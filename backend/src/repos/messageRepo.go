package repos

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"

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

func (*messageRepo) DeleteMessage(messageID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.MessageCollection.DeleteOne(ctx, bson.M{"_id": messageID})
	return err
}

func (*messageRepo) GetMessageById(messageID string) (*models.Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(messageID)
	if err != nil {
		return nil, err
	}

	var message models.Message
	err = models.MessageCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&message)
	if err != nil {
		return nil, err
	}

	return &message, nil
}
