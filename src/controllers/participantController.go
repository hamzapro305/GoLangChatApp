package controllers

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

type participantController struct{}

var ParticipantController = &participantController{}

func (*participantController) AddParticipantToConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {

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
