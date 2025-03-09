package controllers

import (
	"encoding/json"
	"log"

	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type typingController struct{}

var TypingController = &typingController{}

type setUserTypingBody struct {
	ConversationID string `json:"conversationId"`
}

func (*typingController) SetUserStartedTyping(
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[setUserTypingBody](message)
	if parseError != nil {
		return
	}

	conv, err := services.ConversationService.GetConversationById(body.ConversationID)
	if err != nil {
		return
	}

	new_message, err := json.Marshal(map[string]interface{}{
		"type":            "user_started_typing",
		"conversation_id": body.ConversationID,
		"user_id":         userId,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	go services.ConversationWebSocketService.SendMessageToParticipants(new_message, conv.Participants, func(participantId string) bool {
		return participantId == userId
	})
}

func (*typingController) SetUserStoppedTyping(
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[setUserTypingBody](message)
	if parseError != nil {
		return
	}

	conv, err := services.ConversationService.GetConversationById(body.ConversationID)
	if err != nil {
		return
	}

	new_message, err := json.Marshal(map[string]interface{}{
		"type":            "user_stopped_typing",
		"conversation_id": body.ConversationID,
		"user_id":         userId,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	go services.ConversationWebSocketService.SendMessageToParticipants(new_message, conv.Participants, func(participantId string) bool {
		return participantId == userId
	})
}
