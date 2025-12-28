package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	v1 := api.Group("/v1")

	// Agent Proxy
	v1.All("/agents/*", proxy.Balancer(proxy.Config{
		Servers: []string{"http://localhost:8000"},
	}))

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

	// Setup Message Routes
	messageRoutes := v1.Group("/message")
	messageRoutes.Use(middlewares.ProtectedRoute())
	SetupMessageRoutes(messageRoutes)

	v1.Post("/upload", middlewares.ProtectedRoute(), controllers.UploadController.UploadFile)

	webSocketRoute(v1)
}
