package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
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

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// Global clients for internal services
var (
	AuthServiceClient      = NewInternalServiceClient(getEnv("AUTH_SERVICE_URL", "http://localhost:3002"))
	ChatServiceClient      = NewInternalServiceClient(getEnv("CHAT_SERVICE_URL", "http://localhost:3003"))
	MessagingServiceClient = NewInternalServiceClient(getEnv("MESSAGING_SERVICE_URL", "http://localhost:3004"))
	AgentServiceClient     = NewInternalServiceClient(getEnv("AGENT_SERVICE_URL", "http://localhost:8000"))
)
