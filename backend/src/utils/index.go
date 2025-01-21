package utils

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

type utils struct{}

var Utils = &utils{}

func ParseWebsocketMessage[T any](message []byte) (*T, map[string]interface{}) {
	var body T
	if err := json.Unmarshal(message, &body); err != nil {
		return nil, map[string]interface{}{
			"type":    "error",
			"message": "invalid message format",
		}
	}
	return &body, nil
}

// Generic function to parse request body into a given struct
func ParseBody[T any](c *fiber.Ctx) (T, error) {
	var body T

	// Parse request body
	if err := c.BodyParser(&body); err != nil {
		// Return zero value of T on error
		var zeroValue T
		return zeroValue, c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Body parsing failed!",
		})
	}

	return body, nil
}
