package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

const KeysFileName = "/keys/keys.json"
const ApiKeyFile = "/sia-data/apipassword"
const SiaHostIP = "10.10.10.10"

func keys() ([]string, error) {
	b, err := ioutil.ReadFile(KeysFileName)
	if err != nil {
		log.Println("Error while reading keys:", err.Error())
		return nil, err
	}
	var keys []string
	err = json.Unmarshal(b, &keys)
	if err != nil {
		return nil, err
	}
	return keys, nil
}

func apiPass() (string, error) {
	b, err := ioutil.ReadFile(ApiKeyFile)
	if err != nil {
		log.Println("Error while api password:", err.Error())
		return "", err
	}
	return strings.Trim(string(b), " \n"), nil // TODO Trim new line
}

func registerKeys(keys []string, apipass string) error {
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	for _, sk := range keys {
		reqUrl := fmt.Sprintf("http://%s:9980/skynet/addskykey/skykey=%s", SiaHostIP, sk)
		req, err := http.NewRequest("POST", reqUrl, bytes.NewBuffer(reqBody))
		if err != nil {
			log.Println("Error while creating request:", err.Error())
			return err
		}
		req.Header.Set("User-Agent", "Sia-Agent")
		req.SetBasicAuth("", apipass)

		resp, err := client.Do(req)
		if err != nil && !strings.Contains(err.Error(), "Skykey ID already exists") {
			log.Println("Error while adding skykeys:", err.Error())
			return err
		}
		_ = resp.Body.Close()
	}
	return nil
}

func waitUntilApiAvailable(apipass string) error {
	client := http.Client{}
	reqBody, _ := json.Marshal(map[string]string{})
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("http://%s:9980/skynet/skykeys", SiaHostIP), bytes.NewBuffer(reqBody))
		if err != nil {
			return err
		}
		req.Header.Set("User-Agent", "Sia-Agent")
		req.SetBasicAuth("", apipass)
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode > 300 {
			time.Sleep(time.Second)
			continue
		}
		_ = resp.Body.Close()
		break
	}
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
