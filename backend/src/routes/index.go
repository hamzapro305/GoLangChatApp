package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Auth Routes
	auth := v1.Group("/auth")
	setupAuthRoutes(auth)

	// Conversation Routes
	conversation := v1.Group("/conversation")
	conversation.Use(middlewares.ProtectedRoute())
	SetupConversationRoutes(conversation)

	// Setup User Routes
	userRoutes := v1.Group("/user")
	userRoutes.Use(middlewares.ProtectedRoute())
	SetupUserRoutes(userRoutes)

	webSocketRoute(v1)
	setupAuthRoutes(v1)
}
