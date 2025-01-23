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
