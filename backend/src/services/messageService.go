package services

import (
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
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
	var result struct {
		Message models.Message `json:"message"`
	}

	body := map[string]interface{}{
		"conversationId": ConversationID,
		"senderId":       SenderID,
		"content":        Content,
		"type":           Type,
		"replyTo":        ReplyTo,
		"attachmentUrl":  AttachmentUrl,
	}

	err := utils.MessagingServiceClient.Post("/messages", body, &result)
	if err != nil {
		return nil, err
	}

	return &result.Message, nil
}

func (*messageService) GetConversationMessages(ConversationID string) ([]models.Message, error) {
	var result struct {
		Messages []models.Message `json:"messages"`
	}

	err := utils.MessagingServiceClient.Get("/messages/conversation/"+ConversationID, &result)
	if err != nil {
		return nil, err
	}

	return result.Messages, nil
}

func (*messageService) DeleteMessage(messageID string, userID string) error {
	// Delegating delete logic to messaging-service
	return utils.MessagingServiceClient.Post("/messages/delete/"+messageID, map[string]string{"userId": userID}, nil)
}
