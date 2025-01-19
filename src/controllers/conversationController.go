package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

type conversationController struct{}

var ConversationController = &conversationController{}

type createConversationBody struct {
	Participants []string `json:"participants"`
	IsGroup      bool     `json:"isGroup"`
}

func (*conversationController) CreateConversation(c *fiber.Ctx) error {
	body, parseError := services.ParseBody[createConversationBody](c)
	if parseError != nil {
		return parseError
	}

	conv, err := services.ConversationService.CreateConversation(body.Participants, body.IsGroup)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create conversation",
		})
	}

	claims, err := services.JwtService.GetClaims(c)
	if err != nil {
		return err
	}

	services.ConversationWebSocketService.NotifyNewConversation(conv, claims.UserID)

	return c.JSON(fiber.Map{
		"message": "Conversation created",
	})
}

type getUserConversationsBody struct {
	UserId string `json:"userId"`
}

func (*conversationController) GetConversation(c *fiber.Ctx) error {
	// Parse JSON body into struct
	body, parseError := services.ParseBody[getUserConversationsBody](c)
	if parseError != nil {
		return parseError
	}

	convs, err := services.ConversationService.GetUserConversation(body.UserId)
	if err != nil {
		print(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not get conversation",
		})
	}

	return c.JSON(fiber.Map{
		"userConversations": convs,
	})
}
