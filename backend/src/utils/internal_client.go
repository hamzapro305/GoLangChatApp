package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type InternalServiceClient struct {
	BaseURL string
	Client  *http.Client
}

func NewInternalServiceClient(baseURL string) *InternalServiceClient {
	return &InternalServiceClient{
		BaseURL: baseURL,
		Client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *InternalServiceClient) Post(path string, body interface{}, result interface{}) error {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s%s", s.BaseURL, path)
	resp, err := s.Client.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("service error: status %d", resp.StatusCode)
	}

	if result != nil {
		return json.NewDecoder(resp.Body).Decode(result)
	}
	return nil
}

func (s *InternalServiceClient) Get(path string, result interface{}) error {
	url := fmt.Sprintf("%s%s", s.BaseURL, path)
	resp, err := s.Client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("service error: status %d", resp.StatusCode)
	}

	return json.NewDecoder(resp.Body).Decode(result)
}

// Global clients for internal services
var (
	AuthServiceClient      = NewInternalServiceClient("http://localhost:3002")
	ChatServiceClient      = NewInternalServiceClient("http://localhost:3003")
	MessagingServiceClient = NewInternalServiceClient("http://localhost:3004")
	AgentServiceClient     = NewInternalServiceClient("http://localhost:8000")
)
