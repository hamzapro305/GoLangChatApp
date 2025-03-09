package controllers

import (
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type webSocketMessageHandler struct{}

var WebSocketMessageHandler = &webSocketMessageHandler{}

// Message structure for WebSocket communication
type IncomingMessage struct {
	Type          string `json:"type"`
	CurrentUserId string `json:"current_user_id"`
}

func (*webSocketMessageHandler) WebSocketMessageHandler(message []byte) {
	// Parse the incoming JSON message
	incomingMsg, err := utils.ParseWebsocketMessage[IncomingMessage](message)
	if err != nil {
		return
	}
	switch incomingMsg.Type {
	case "create_conversation":
		ConversationController.CreateConversation(message, incomingMsg.CurrentUserId)
	case "create_group_conversation":
		ConversationController.CreateGroupConversation(message, incomingMsg.CurrentUserId)
	case "create_message":
		MessageContrller.CreateConversationMessages(message, incomingMsg.CurrentUserId)
	case "user_started_typing":
		TypingController.SetUserStartedTyping(message, incomingMsg.CurrentUserId)
	case "user_stopped_typing":
		TypingController.SetUserStoppedTyping(message, incomingMsg.CurrentUserId)
	case "add_participant_to_conversation":
		ParticipantController.AddParticipantToConversation(message, incomingMsg.CurrentUserId)
	default:
		// c.WriteJSON(map[string]interface{}{
		// 	"type":    "Error",
		// 	"message": "Invalid Message type",
		// })
		return
	}

}
