package controllers

import (
	"fmt"

	"github.com/gofiber/contrib/websocket"
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
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[createConversationBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	conv, err := services.ConversationService.CreateConversation(body.Participants, userClaims.UserID)
	if err != nil {
		c.WriteJSON(map[string]interface{}{
			"type":    "error",
			"message": "Could not create conversation",
		})
		return
	}

	go services.ConversationWebSocketService.SendNewConversationMessage(conv, userClaims.UserID)

	c.WriteJSON(map[string]interface{}{
		"type":         "conversation_creation_completed",
		"message":      "Conversation created",
		"conversation": conv,
	})
}

type createGrupConversationBody struct {
	Participants []string `json:"participants"`
	GroupName    string   `json:"groupName"`
}

func (*conversationController) CreateGroupConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[createGrupConversationBody](message)
	if parseError != nil {
		c.WriteJSON(parseError)
		return
	}

	conv, err := services.ConversationService.CreateGroupConversation(body.Participants, userClaims.UserID, body.GroupName)
	if err != nil {
		c.WriteJSON(map[string]interface{}{
			"type":    "error",
			"message": "Could not create conversation",
		})
		return
	}

	go services.ConversationWebSocketService.SendNewGroupConversationMessage(conv, userClaims.UserID)

	c.WriteJSON(map[string]interface{}{
		"type":         "conversation_creation_completed",
		"message":      "Conversation created",
		"conversation": conv,
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

type deleteConversationBody struct {
	ConversationID string `json:"conversationId"`
}

func (*conversationController) DeleteConversation(
	c *websocket.Conn,
	userClaims services.UserClaims,
	message []byte,
) {
	body, parseError := utils.ParseWebsocketMessage[deleteConversationBody](message)
	if parseError != nil {
		fmt.Println("Error parsing delete conversation message:", parseError)
		c.WriteJSON(parseError)
		return
	}

	fmt.Println("ConversationController: Calling DeleteConversationWithProgress for ID:", body.ConversationID)
	services.ConversationService.DeleteConversationWithProgress(c, body.ConversationID)
}

type leaveConversationBody struct {
	ConversationID string `json:"conversationId"`
}

func (*conversationController) LeaveConversation(c *fiber.Ctx) error {
	body, parseError := utils.ParseBody[leaveConversationBody](c)
	if parseError != nil {
		return parseError
	}

	userClaims, err := services.JwtService.GetClaims(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized user",
		})
	}

	err = services.ConversationService.LeaveConversation(body.ConversationID, userClaims.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not leave conversation",
		})
	}

	return c.JSON(fiber.Map{
		"message":        "Successfully left conversation",
		"conversationId": body.ConversationID,
	})
}
