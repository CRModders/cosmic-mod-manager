package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func Fetch(url string) ([]byte, error) {
	res, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
		return nil, errors.New("Failed to fetch URL: " + url)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil, errors.New("Failed to read the response from URL: " + url)
	}

	return body, nil
}

func StringFromBytes(bytes []byte) string {
	return string(bytes)
}

func JSONFromBytes(bytes []byte) (map[string]interface{}, error) {
	var jsonData = make(map[string]interface{})
	err := json.Unmarshal(bytes, &jsonData)
	if err != nil {
		fmt.Println(err)
		return nil, errors.New("failed to parse JSON")
	}

	return jsonData, nil
}
