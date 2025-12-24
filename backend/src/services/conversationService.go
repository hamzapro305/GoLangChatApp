package services

import (
	"fmt"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type conversationService struct{}

// ConversationService provides conversation-related operations
var ConversationService = &conversationService{}

func (*conversationService) CreateConversation(participantIDs []string, createdBy string) (models.Conversation, error) {
	var participants []models.Participant
	for _, userID := range participantIDs {
		participants = append(participants, models.Participant{
			UserID:   userID,
			JoinedAt: time.Now(),
		})
	}

	conv := models.Conversation{
		ID:           primitive.NewObjectID(),
		Participants: participants,
		CreatedAt:    time.Now(),
		Leader:       createdBy,
		IsGroup:      false,
	}

	return conv, repos.ConversationRepo.CreateConversation(conv)
}

func (*conversationService) CreateGroupConversation(
	participantIDs []string,
	createdBy string,
	groupName string,
) (models.GroupConversation, error) {
	var participants []models.Participant
	for _, userID := range participantIDs {
		participants = append(participants, models.Participant{
			UserID:   userID,
			JoinedAt: time.Now(),
		})
	}

	conv := models.GroupConversation{
		ID:           primitive.NewObjectID(),
		Participants: participants,
		GroupName:    groupName,
		CreatedAt:    time.Now(),
		Leader:       createdBy,
		IsGroup:      true,
	}

	return conv, repos.ConversationRepo.CreateGroupConversation(conv)
}

func (*conversationService) GetUserConversation(userId string) ([]models.GroupConversation, error) {
	return repos.ConversationRepo.GetUserConversations(userId)
}

func (*conversationService) GetConversationById(conversationId string) (*models.GroupConversation, error) {
	return repos.ConversationRepo.GetConversationById(conversationId)
}

func (*conversationService) AddParticipantToConversation(convId string, userId string) error {
	return repos.ConversationRepo.AddParticipantToConversation(convId, userId)
}

func (*conversationService) DeleteConversationWithProgress(c *websocket.Conn, conversationId string) {
	fmt.Println("Starting DeleteConversationWithProgress for:", conversationId)
	messages, err := repos.MessageRepo.GetConversationMessages(conversationId)
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
		// 1. Delete attachment if exists
		if msg.AttachmentUrl != "" {
			fmt.Println("Deleting attachment:", msg.AttachmentUrl)
			err := repos.StorageRepo.DeleteFile(msg.AttachmentUrl)
			if err != nil {
				fmt.Println("Error deleting file:", err)
			}
		}

		// 2. Delete message from DB
		_ = repos.MessageRepo.DeleteMessage(msg.ID)

		// 3. Send progress update
		if i%5 == 0 || i == total-1 { // limit updates slightly if needed, but for now every update is fine
			progress := fiber.Map{
				"type":           "delete_progress",
				"deletedCount":   i + 1,
				"totalCount":     total,
				"conversationId": conversationId,
			}
			fmt.Println("Sending progress:", progress)
			c.WriteJSON(progress)
		} else {
			c.WriteJSON(fiber.Map{
				"type":           "delete_progress",
				"deletedCount":   i + 1,
				"totalCount":     total,
				"conversationId": conversationId,
			})
		}
	}

	// 4. Delete Conversation
	err = repos.ConversationRepo.DeleteConversation(conversationId)
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
	return repos.ConversationRepo.LeaveConversation(conversationId, userId)
}
