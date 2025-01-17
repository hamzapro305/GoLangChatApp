package routes

import (
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Auth Routes
	auth := v1.Group("/auth")
	setupAuthRoutes(auth)

	webSocketRoute(v1)
	setupAuthRoutes(v1)
}
