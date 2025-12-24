package repos

import (
	"context"
	"fmt"
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type conversationRepo struct{}

var ConversationRepo = &conversationRepo{}

func (*conversationRepo) CreateConversation(conv models.Conversation) error {
	// Create a new conversation
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.ConversationCollection.InsertOne(ctx, conv)
	return err
}
func (*conversationRepo) CreateGroupConversation(conv models.GroupConversation) error {
	// Create a new conversation
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.ConversationCollection.InsertOne(ctx, conv)
	return err
}

func (*conversationRepo) GetConversationById(conversationID string) (*models.GroupConversation, error) {
	// Get a conversation by ID
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	convID, err := primitive.ObjectIDFromHex(conversationID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": convID}
	var conversation models.GroupConversation
	err = models.ConversationCollection.FindOne(ctx, filter).Decode(&conversation)
	if err != nil {
		return nil, err
	}

	return &conversation, nil
}

func (*conversationRepo) GetUserConversations(userID string) ([]models.GroupConversation, error) {
	// Get all conversations for a user ID
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	filter := bson.M{
		"participants": bson.M{
			"$elemMatch": bson.M{
				"userId": userID,
				"leftAt": bson.M{"$exists": false},
			},
		},
	}
	cursor, err := models.ConversationCollection.Find(ctx, filter)
	if err != nil {
		fmt.Println("Error finding conversations:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var conversations []models.GroupConversation
	if err = cursor.All(ctx, &conversations); err != nil {
		fmt.Println("Error decoding conversations:", err)
		return nil, err
	}

	// Ensure we return an empty slice instead of nil
	if conversations == nil {
		return []models.GroupConversation{}, nil
	}

	return conversations, nil
}

func (*conversationRepo) DeleteConversation(conversationID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	convID, err := primitive.ObjectIDFromHex(conversationID)
	if err != nil {
		return err
	}

	_, err = models.ConversationCollection.DeleteOne(ctx, bson.M{"_id": convID})
	return err
}

func (*conversationRepo) AddParticipantToConversation(conversationID string, userID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	convID, err := primitive.ObjectIDFromHex(conversationID)
	if err != nil {
		return err
	}

	newParticipant := models.Participant{
		UserID:   userID,
		JoinedAt: time.Now(),
	}

	// Update conversation to add new participant
	filter := bson.M{"_id": convID}
	update := bson.M{
		"$push": bson.M{"participants": newParticipant},
		"$set":  bson.M{"updatedAt": time.Now()},
	}

	_, err = models.ConversationCollection.UpdateOne(ctx, filter, update, options.Update().SetUpsert(true))
	if err != nil {
		return err
	}

	return nil

}

func (*conversationRepo) LeaveConversation(conversationID string, userID string) error {
	fmt.Printf("Repo: LeaveConversation called for conv: %s, user: %s\n", conversationID, userID)
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	convID, err := primitive.ObjectIDFromHex(conversationID)
	if err != nil {
		fmt.Println("Repo: LeaveConversation: Invalid conversationID:", err)
		return err
	}

	filter := bson.M{"_id": convID, "participants.userId": userID}
	update := bson.M{
		"$set": bson.M{"participants.$.leftAt": time.Now()},
	}

	result, err := models.ConversationCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		fmt.Println("Repo: LeaveConversation: DB Update error:", err)
		return err
	}
	fmt.Printf("Repo: LeaveConversation: Update result: %+v\n", result)

	return nil
}

func (*conversationRepo) IsUserInConversation(conversationID string, userID string) bool {
	// Check if a user is in a conversation
	conv, err := ConversationRepo.GetConversationById(conversationID)
	if err != nil {
		return false
	}

	for _, participant := range conv.Participants {
		if participant.UserID == userID {
			return true
		}
	}
	return false
}
