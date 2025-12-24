package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Message struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ConversationID string             `bson:"conversationId" json:"conversationId"`
	SenderID       string             `bson:"senderId" json:"senderId"`
	Content        string             `bson:"content" json:"content"`
	Type           string             `bson:"type" json:"type"` // e.g., "text", "image", "file"
	CreatedAt      time.Time          `bson:"createdAt" json:"createdAt"`
}

var MessageCollection *mongo.Collection
