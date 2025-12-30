package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type messageService struct{}

var MessageService = &messageService{}

// Notify embedding service about new message (fire-and-forget)
func (*messageService) notifyEmbeddingService(messageID string) {
	go func() {
		embeddingServiceURL := "http://localhost:8002/embeddings/generate"

		payload := map[string]string{
			"message_id": messageID,
		}

		jsonData, err := json.Marshal(payload)
		if err != nil {
			log.Printf("Error marshalling embedding request: %v", err)
			return
		}

		resp, err := http.Post(embeddingServiceURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			log.Printf("Error calling embedding service: %v", err)
			return
		}
		defer resp.Body.Close()

		log.Printf("✓ Notified embedding service for message %s", messageID)
	}()
}

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

	// Set embedding status to pending for text messages
	if Type == "text" && Content != "" {
		msg.EmbeddingStatus = "pending"
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

	// Notify embedding service if it's a text message with pending status
	if msg.EmbeddingStatus == "pending" {
		MessageService.notifyEmbeddingService(msg.ID.Hex())
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
