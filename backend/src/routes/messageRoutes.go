package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
)

func SetupMessageRoutes(messageRoutes fiber.Router) {
	messageRoutes.Post("/get", controllers.MessageController.GetConversationMessages)
	messageRoutes.Delete("/:messageId", controllers.MessageController.DeleteMessage)
}
