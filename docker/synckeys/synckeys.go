package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
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
		log.Println("Error while api password:", err.Error())
		return "", err
	}
	log.Println("Successfully read apipassword.")
	return strings.Trim(string(b), " \n"), nil
}

func registerKeys(siadIP string, keys []string, apipass string) error {
	fmt.Printf("Will process %d keys.\n", len(keys))
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	for _, sk := range keys {
		fmt.Println("Adding key:", sk)
		reqUrl := fmt.Sprintf("http://%s:9980/skynet/addskykey?skykey=%s", siadIP, url.QueryEscape(sk))
		req, err := http.NewRequest("POST", reqUrl, bytes.NewBuffer(reqBody))
		if err != nil {
			log.Println("Error while creating request:", err.Error())
			return err
		}
		req.Header.Set("User-Agent", "Sia-Agent")
		req.SetBasicAuth("", apipass)

		resp, err := client.Do(req)
		if err != nil {
			log.Println("Error while adding skykeys:", err.Error())
			return err
		}
		defer resp.Body.Close()

		b, _ := ioutil.ReadAll(resp.Body)
		bodyStr := string(b)
		if resp.StatusCode >= 300 && !strings.Contains(bodyStr, "Skykey ID already exists") {
			log.Println("Error while adding skykeys:", bodyStr)
			return err
		}
		fmt.Println("Successfully added!")
	}
	return nil
}

func waitUntilApiAvailable(siadIP, apipass string) error {
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("http://%s:9980/skynet/skykeys", siadIP), bytes.NewBuffer(reqBody))
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
	siadIP, ok := os.LookupEnv("SIAD_IP")
	if !ok {
		siadIP = "127.0.0.1"
	}

	apiPass, err := apiPass()
	if err != nil {
		panic(err)
	}
	keys, err := keys()
	if err != nil {
		panic(err)
	}
	err = waitUntilApiAvailable(siadIP, apiPass)
	if err != nil {
		panic(err)
	}
	err = registerKeys(siadIP, keys, apiPass)
	if err != nil {
		panic(err)
	}
}
