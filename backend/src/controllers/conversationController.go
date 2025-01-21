package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type conversationController struct{}

var ConversationController = &conversationController{}

type createConversationBody struct {
	Participants []string `json:"participants"`
	IsGroup      bool     `json:"isGroup"`
}

func (*conversationController) CreateConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[createConversationBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	conv, err := services.ConversationService.CreateConversation(body.Participants, body.IsGroup, userClaims.UserID)
	if err != nil {
		c.WriteJSON(map[string]interface{}{
			"type":    "error",
			"message": "Could not create conversation",
		})
		return
	}

	services.ConversationWebSocketService.SendNewConversationMessage(conv, userClaims.UserID)

	c.WriteJSON(map[string]interface{}{
		"type":    "conversation_creation_completed",
		"message": "Conversation created",
	})
}

type getUserConversationsBody struct {
	UserId string `json:"userId"`
}

func (*conversationController) GetConversation(c *fiber.Ctx) error {
	// Parse JSON body into struct
	body, parseError := utils.ParseBody[getUserConversationsBody](c)
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
