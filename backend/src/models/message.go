package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Message struct {
	ID             primitive.ObjectID `bson:"_id,omitempty"`
	ConversationID string             `bson:"conversationId"`
	SenderID       string             `bson:"senderId"`
	Content        string             `bson:"content"`
	CreatedAt      time.Time          `bson:"createdAt"`
}

var MessageCollection *mongo.Collection
