package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type messageController struct{}

var MessageContrller = &messageController{}

func (*messageController) GetConversationMessages(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {

}

type createMessageBody struct {
	ConversationID string `bson:"conversationId"`
	Content        string `bson:"content"`
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

	msg, err := services.MessageService.CreateMessage(
		body.ConversationID,
		userClaims.UserID,
		body.Content,
	)
	if err != nil {
		c.WriteJSON(map[string]interface{}{
			"type":    "error",
			"message": "message creation failed",
		})
		return
	}
	services.ConversationWebSocketService.SendNewMessageInConversationMessage(*msg)
	c.WriteJSON(map[string]interface{}{
		"type":    "action_message_creation_done",
		"message": msg,
	})
}
