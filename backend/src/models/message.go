package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Message struct {
	ID              primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	ConversationID  string              `bson:"conversationId" json:"conversationId"`
	SenderID        string              `bson:"senderId" json:"senderId"`
	Content         string              `bson:"content" json:"content"`
	AttachmentUrl   string              `bson:"attachmentUrl" json:"attachmentUrl"`
	Type            string              `bson:"type" json:"type"` // e.g., "text", "image", "file"
	ReplyTo         *primitive.ObjectID `bson:"replyTo,omitempty" json:"replyTo,omitempty"`
	Embedding       []float32           `bson:"embedding,omitempty" json:"embedding,omitempty"`
	EmbeddingStatus string              `bson:"embeddingStatus,omitempty" json:"embeddingStatus,omitempty"` // "pending", "ready", "failed"
	CreatedAt       time.Time           `bson:"createdAt" json:"createdAt"`
}

var MessageCollection *mongo.Collection
