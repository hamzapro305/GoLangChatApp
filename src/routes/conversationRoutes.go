package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
)

func SetupConversationRoutes(conversation fiber.Router) {
	conversation.Post("/create", controllers.ConversationController.CreateConversation)
	conversation.Post("/get", controllers.ConversationController.GetConversation)
}
