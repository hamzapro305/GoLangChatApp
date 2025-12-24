package services

import (
	"errors"
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
	Type string,
	ReplyTo string,
	AttachmentUrl string,
) (*models.Message, error) {
	var msg models.Message = models.Message{
		ID:             primitive.NewObjectID(),
		ConversationID: ConversationID,
		SenderID:       SenderID,
		Content:        Content,
		AttachmentUrl:  AttachmentUrl,
		Type:           Type,
		CreatedAt:      time.Now(),
	}

	if ReplyTo != "" {
		replyToID, err := primitive.ObjectIDFromHex(ReplyTo)
		if err == nil {
			msg.ReplyTo = &replyToID
		}
	}
	err := repos.MessageRepo.CreateMessage(msg)
	if err != nil {
		return nil, err
	}
	return &msg, nil
}

func (*messageService) GetConversationMessages(ConversationID string) ([]models.Message, error) {
	return repos.MessageRepo.GetConversationMessages(ConversationID)
}

func (*messageService) DeleteMessage(messageID string, userID string) error {
	msg, err := repos.MessageRepo.GetMessageById(messageID)
	if err != nil {
		return err
	}

	if msg.SenderID != userID {
		return errors.New("unauthorized")
	}

	// Delete attachment if exists
	if msg.AttachmentUrl != "" {
		_ = repos.StorageRepo.DeleteFile(msg.AttachmentUrl)
	}

	return repos.MessageRepo.DeleteMessage(msg.ID)
}
