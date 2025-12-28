package services

import (
	"fmt"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type conversationService struct{}

// ConversationService provides conversation-related operations
var ConversationService = &conversationService{}

func (*conversationService) CreateConversation(participantIDs []string, createdBy string) (models.Conversation, error) {
	var result struct {
		Conversation models.Conversation `json:"conversation"`
	}

	body := map[string]interface{}{
		"participants": participantIDs,
		"createdBy":    createdBy,
		"isGroup":      false,
	}

	err := utils.ChatServiceClient.Post("/conversations", body, &result)
	return result.Conversation, err
}

func (*conversationService) CreateGroupConversation(
	participantIDs []string,
	createdBy string,
	groupName string,
) (models.GroupConversation, error) {
	var result struct {
		Conversation models.GroupConversation `json:"conversation"`
	}

	body := map[string]interface{}{
		"participants": participantIDs,
		"createdBy":    createdBy,
		"groupName":    groupName,
		"isGroup":      true,
	}

	err := utils.ChatServiceClient.Post("/conversations", body, &result)
	return result.Conversation, err
}

func (*conversationService) GetUserConversation(userId string) ([]models.GroupConversation, error) {
	var result struct {
		Conversations []models.GroupConversation `json:"userConversations"`
	}

	err := utils.ChatServiceClient.Get("/conversations/user/"+userId, &result)
	return result.Conversations, err
}

func (*conversationService) GetConversationById(conversationId string) (*models.GroupConversation, error) {
	var result struct {
		Conversation models.GroupConversation `json:"conversation"`
	}

	err := utils.ChatServiceClient.Get("/conversations/"+conversationId, &result)
	return &result.Conversation, err
}

func (*conversationService) AddParticipantToConversation(convId string, userId string) error {
	body := map[string]string{"userId": userId}
	return utils.ChatServiceClient.Post("/conversations/"+convId+"/participants", body, nil)
}

func (*conversationService) DeleteConversationWithProgress(c *websocket.Conn, conversationId string) {
	fmt.Println("Starting DeleteConversationWithProgress for:", conversationId)

	// 1. Get messages from messaging-service
	messages, err := MessageService.GetConversationMessages(conversationId)
	if err != nil {
		fmt.Println("Error fetching messages:", err)
		c.WriteJSON(fiber.Map{
			"type":    "error",
			"message": "failed to fetch messages",
		})
		return
	}

	total := len(messages)
	fmt.Println("Found", total, "messages to delete")
	for i, msg := range messages {
		// 2. Delete message via messaging-service
		err := MessageService.DeleteMessage(msg.ID.Hex(), msg.SenderID) // Assuming msg.ID is primitive.ObjectID
		if err != nil {
			fmt.Println("Error deleting message:", err)
		}

		// 3. Send progress update
		progress := fiber.Map{
			"type":           "delete_progress",
			"deletedCount":   i + 1,
			"totalCount":     total,
			"conversationId": conversationId,
		}
		c.WriteJSON(progress)
	}

	// 4. Delete Conversation via chat-service
	err = utils.ChatServiceClient.Post("/conversations/delete/"+conversationId, nil, nil)
	if err != nil {
		fmt.Println("Error deleting conversation:", err)
		c.WriteJSON(fiber.Map{
			"type":    "error",
			"message": "failed to delete conversation",
		})
		return
	}

	// 5. Final success message
	fmt.Println("Conversation deleted successfully")
	c.WriteJSON(fiber.Map{
		"type":           "conversation_deleted",
		"conversationId": conversationId,
	})
}

func (*conversationService) LeaveConversation(conversationId string, userId string) error {
	body := map[string]string{"userId": userId}
	return utils.ChatServiceClient.Post("/conversations/"+conversationId+"/leave", body, nil)
}
