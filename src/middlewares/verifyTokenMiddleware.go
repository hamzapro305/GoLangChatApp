package middlewares

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

func ProtectedRoute() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract the token from the Authorization header
		authHeader := c.Get("Authorization")

		// Check if the header is present and properly formatted
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing or malformed token",
			})
		}

		// Extract the token part, removing "Bearer " prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Verify the token using VerifyToken function
		claims, err := services.VerifyToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		// If token is valid, store claims in Locals for further use in routes
		c.Locals("userClaims", claims)

		// Continue to the next middleware or handler
		return c.Next()
	}
}
