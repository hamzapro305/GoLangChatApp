package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type messageController struct{}

var MessageContrller = &messageController{}

type getConversationMessagesBody struct {
	ConversationID string `json:"conversationId"`
}

func (*messageController) GetConversationMessages(c *fiber.Ctx) error {
	body, parseError := utils.ParseBody[getConversationMessagesBody](c)
	if parseError != nil {
		return parseError
	}

	messages, err := services.MessageService.GetConversationMessages(body.ConversationID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot get messages",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"messages": messages,
	})
}

type createMessageBody struct {
	ConversationID string `json:"conversationId"`
	Content        string `json:"content"`
	TempId         string `json:"tempId"`
}

func (*messageController) CreateConversationMessages(
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[createMessageBody](message)
	if parseError != nil {
		return
	}

	msg, _ := services.MessageService.CreateMessage(
		body.ConversationID,
		userId,
		body.Content,
	)
	go services.ConversationWebSocketService.SendNewMessageInConversationMessage(*msg)
}
