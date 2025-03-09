package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type conversationController struct{}

var ConversationController = &conversationController{}

type createConversationBody struct {
	Participants []string `json:"participants"`
}

func (*conversationController) CreateConversation(
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[createConversationBody](message)
	if parseError != nil {
		return
	}

	conv, _ := services.ConversationService.CreateConversation(body.Participants, userId)

	go services.ConversationWebSocketService.SendNewConversationMessage(conv, userId)
}

type createGrupConversationBody struct {
	Participants []string `json:"participants"`
	GroupName    string   `json:"groupName"`
}

func (*conversationController) CreateGroupConversation(
	message []byte,
	userId string,
) {
	body, parseError := utils.ParseWebsocketMessage[createGrupConversationBody](message)
	if parseError != nil {
		return
	}

	conv, _ := services.ConversationService.CreateGroupConversation(body.Participants, userId, body.GroupName)
	go services.ConversationWebSocketService.SendNewGroupConversationMessage(conv, userId)
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
