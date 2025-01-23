package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type webSocketMessageHandler struct{}

var WebSocketMessageHandler = &webSocketMessageHandler{}

// Message structure for WebSocket communication
type IncomingMessage struct {
	Type string `json:"type"`
}

func (*webSocketMessageHandler) WebSocketMessageHandler(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	// Parse the incoming JSON message
	incomingMsg, err := utils.ParseWebsocketMessage[IncomingMessage](message)
	if err != nil {
		c.WriteJSON(err)
		return
	}
	switch incomingMsg.Type {
	case "create_conversation":
		ConversationController.CreateConversation(c, userClaims, message)
	case "create_group_conversation":
		ConversationController.CreateGroupConversation(c, userClaims, message)
	case "create_message":
		MessageContrller.CreateConversationMessages(c, userClaims, message)
	// case "open_conversation":
	// 	ConversationController.OpenConversation(c, userClaims, message)
	case "add_participant_to_conversation":
		ParticipantController.AddParticipantToConversation(c, userClaims, message)
	default:
		c.WriteJSON(map[string]interface{}{
			"type":    "Error",
			"message": "Invalid Message type",
		})
		return
	}

}
