package repos

import (
	"context"
	"fmt"

	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
)

type messageRepo struct{}

var MessageRepo = &messageRepo{}

func (*messageRepo) CreateMessage(message models.Message) error {
	// Create a new conversation
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.MessageCollection.InsertOne(ctx, message)
	return err
}

func (*messageRepo) GetConversationMessages(conversationId string) ([]models.Message, error) {
	// Get all conversations for a user ID
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	filter := bson.M{"conversationId": conversationId}
	cursor, err := models.MessageCollection.Find(ctx, filter)
	if err != nil {
		fmt.Println("Error finding conversations messages:", err)
		return []models.Message{}, err
	}
	defer cursor.Close(ctx)

	var messages []models.Message
	if err = cursor.All(ctx, &messages); err != nil {
		fmt.Println("Error decoding messages:", err)
		return []models.Message{}, err
	}

	// Ensure we return an empty slice instead of nil
	if messages == nil {
		return []models.Message{}, nil
	}

	return messages, nil
}
