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
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[addParticipantToConversationBody](message)
	if parseError != nil {
		return
	}

	// Getting Conversation
	conv, err := services.ConversationService.GetConversationById(body.ConversationId)
	if err != nil {
		return
	}


	// Check if user is part of conversation already
	for _, participant := range conv.Participants {
		participantId := participant.UserID
		if participantId == body.ParticipantId {
			
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
