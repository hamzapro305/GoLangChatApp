package services

import (
	"github.com/gofiber/fiber/v2"
)

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
