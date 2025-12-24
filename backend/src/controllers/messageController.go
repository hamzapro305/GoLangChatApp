package controllers

import (
	"github.com/gofiber/contrib/websocket"
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
	AttachmentUrl  string `json:"attachmentUrl"`
	MessageType    string `json:"messageType"`
	TempId         string `json:"tempId"`
	ReplyTo        string `json:"replyTo"`
}

func (*messageController) CreateConversationMessages(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[createMessageBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	msgType := body.MessageType
	if msgType == "" {
		msgType = "text"
	}

	msg, err := services.MessageService.CreateMessage(
		body.ConversationID,
		userClaims.UserID,
		body.Content,
		msgType,
		body.ReplyTo,
		body.AttachmentUrl,
	)
	if err != nil {
		c.WriteJSON(fiber.Map{
			"type":           "error",
			"message":        "message creation failed",
			"tempId":         body.TempId,
			"conversationId": body.ConversationID,
		})
		return
	}
	services.ConversationWebSocketService.SendNewMessageInConversationMessage(*msg)
	c.WriteJSON(fiber.Map{
		"type":           "action_message_creation_done",
		"message":        msg,
		"tempId":         body.TempId,
		"conversationId": body.ConversationID,
	})
}

func (*messageController) DeleteMessage(c *fiber.Ctx) error {
	messageID := c.Params("messageId")
	userClaims := c.Locals("user").(services.UserClaims)

	err := services.MessageService.DeleteMessage(messageID, userClaims.UserID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Message deleted",
	})
}
