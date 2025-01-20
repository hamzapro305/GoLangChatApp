package services

import (
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type messageService struct{}

var MessageService = &messageService{}

func (*messageService) CreateMessage(
	ConversationID string,
	SenderID string,
	Content string,
) (*models.Message, error) {
	var msg models.Message = models.Message{
		ID:             primitive.NewObjectID(),
		ConversationID: ConversationID,
		SenderID:       SenderID,
		Content:        Content,
		CreatedAt:      time.Now(),
	}
	err := repos.MessageRepo.CreateMessage(msg)
	if err != nil {
		return nil, err
	}
	return &msg, nil
}

func (*messageService) GetConversationMessages(ConversationID string) {
	
}
