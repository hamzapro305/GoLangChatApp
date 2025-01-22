package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type participantController struct{}

var ParticipantController = &participantController{}

type addParticipantToConversationBody struct {
	ConversationId string
	ParticipantId  string
}

func (*participantController) AddParticipantToConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[addParticipantToConversationBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	// Getting Conversation
	conv, err := services.ConversationService.GetConversationById(body.ConversationId)
	if err != nil {
		c.WriteJSON(map[string]interface{}{
			"type":       "error",
			"error_type": "invalid_id",
			"message":    "invalid conversation id",
		})
		return
	}

	//  Check if user is leader of conversation
	if conv.Leader != userClaims.UserID {
		c.WriteJSON(map[string]interface{}{
			"type":       "error",
			"error_type": "not_leader",
			"message":    "user is not the leader of conversation",
		})
		return
	}

	// Check if user is part of conversation already
	for _, participant := range conv.Participants {
		participantId := participant.UserID.Hex()
		if participantId == body.ParticipantId {
			c.WriteJSON(map[string]interface{}{
				"type":       "error",
				"error_type": "already_participant",
				"message":    "user is already part of conversation",
			})
			return
		}
	}
	
}

func (*participantController) RemoveParticipantFromConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {

}

func (*participantController) ExitParticipantFromConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {

}
