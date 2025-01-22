package services

import (
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type conversationService struct{}

// ConversationService provides conversation-related operations
var ConversationService = &conversationService{}

func (*conversationService) CreateConversation(participantIDs []string, isGroup bool, createdBy string) (models.Conversation, error) {
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
		IsGroup:      isGroup,
		CreatedAt:    time.Now(),
		Leader:       createdBy,
	}

	return conv, repos.ConversationRepo.CreateConversation(conv)
}

func (*conversationService) GetUserConversation(userId string) ([]models.Conversation, error) {
	return repos.ConversationRepo.GetUserConversations(userId)
}

func (*conversationService) GetConversationById(conversationId string) (*models.Conversation, error) {
	return repos.ConversationRepo.GetConversationById(conversationId)
}

func (*conversationService) AddParticipantToConversation(convId string, userId string) error {
	return repos.ConversationRepo.AddParticipantToConversation(convId, userId)
}
