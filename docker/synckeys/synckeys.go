package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gitlab.com/NebulousLabs/errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const KeysFileName = "/keys/keys.json"
const ApiKeyFile = "/sia-data/apipassword"

func keys() ([]string, error) {
	b, err := ioutil.ReadFile(KeysFileName)
	if err != nil {
		log.Println("Error while reading keys:", err.Error())
		return nil, err
	}
	var keys []string
	err = json.Unmarshal(b, &keys)
	if err != nil {
		log.Println("Error while unmarshalling keys:", err.Error())
		return nil, err
	}
	log.Println("Successfully read keys.")
	return keys, nil
}

func apiPass() (string, error) {
	b, err := ioutil.ReadFile(ApiKeyFile)
	if err != nil {
		log.Println("Error while reading api password:", err.Error())
		return "", err
	}
	log.Println("Successfully read api password.")
	return strings.Trim(string(b), " \n"), nil
}

func registerKeys(keys []string, apipass string) error {
	fmt.Printf("Will process %d keys.\n", len(keys))
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	var errs []error
	for _, sk := range keys {
		fmt.Println("Adding key:", sk)
		reqUrl := fmt.Sprintf("http://sia:9980/skynet/addskykey?skykey=%s", url.QueryEscape(sk))
		req, err := http.NewRequest("POST", reqUrl, bytes.NewBuffer(reqBody))
		if err != nil {
			errs = append(errs, errors.AddContext(err, "error while creating request"))
			fmt.Println("Failed to add key!")
			continue
		}
		req.Header.Set("User-Agent", "Sia-Agent")
		req.SetBasicAuth("", apipass)

		resp, err := client.Do(req)
		if err != nil {
			errCtx := fmt.Sprintf("error while adding skykey %s", sk)
			errs = append(errs, errors.AddContext(err, errCtx))
			fmt.Println("Failed to add key!")
			continue
		}
		b, err := ioutil.ReadAll(resp.Body)
		_ = resp.Body.Close()
		if err!=nil {
			errs =  append(errs, errors.AddContext(err, "failed to read reÎsponse"))
			fmt.Println("Failed to add key!")
			continue
		}
		bodyStr := string(b)
		if resp.StatusCode >= 300 && !strings.Contains(bodyStr, "Skykey ID already exists") {
			errCtx := fmt.Sprintf("error while adding skykey %s", sk)
			errs = append(errs, errors.AddContext(fmt.Errorf(bodyStr), errCtx))
			fmt.Println("Failed to add key!")
			continue
		}
		fmt.Println("Successfully added!")
	}
	return errors.Compose(errs...)
}

func waitUntilApiAvailable(apipass string) error {
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("http://sia:9980/skynet/skykeys"), bytes.NewBuffer(reqBody))
		if err != nil {
			return err
		}
		req.Header.Set("User-Agent", "Sia-Agent")
		req.SetBasicAuth("", apipass)
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode > 300 {
			fmt.Println("Waiting for API...")
			time.Sleep(time.Second)
			continue
		}
		_ = resp.Body.Close()
		break
	}
	fmt.Println("API ready!")
	return nil
}

func main() {
	apiPass, err := apiPass()
	if err != nil {
		panic(err)
	}
	keys, err := keys()
	if err != nil {
		panic(err)
	}
	err = waitUntilApiAvailable(apiPass)
	if err != nil {
		panic(err)
	}
	err = registerKeys(keys, apiPass)
	if err != nil {
		panic(err)
	}
}
