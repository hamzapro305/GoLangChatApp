package controllers

import (
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type typingController struct{}

var TypingController = &typingController{}

type setUserTypingBody struct {
	ConversationID string `json:"conversationId"`
}

func (*typingController) SetUserStartedTyping(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[setUserTypingBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	conv, err := services.ConversationService.GetConversationById(body.ConversationID)
	if err != nil {
		c.WriteJSON(err)
		return
	}

	new_message, err := json.Marshal(map[string]interface{}{
		"type":            "user_started_typing",
		"conversation_id": body.ConversationID,
		"user_id":         userClaims.UserID,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	go services.ConversationWebSocketService.SendMessageToParticipants(new_message, conv.Participants, func(participantId string) bool {
		return participantId == userClaims.UserID
	})
}

func (*typingController) SetUserStoppedTyping(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[setUserTypingBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	conv, err := services.ConversationService.GetConversationById(body.ConversationID)
	if err != nil {
		c.WriteJSON(err)
		return
	}

	new_message, err := json.Marshal(map[string]interface{}{
		"type":            "user_stopped_typing",
		"conversation_id": body.ConversationID,
		"user_id":         userClaims.UserID,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	go services.ConversationWebSocketService.SendMessageToParticipants(new_message, conv.Participants, func(participantId string) bool {
		return participantId == userClaims.UserID
	})
}
