package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID             primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	ConversationID string              `bson:"conversationId" json:"conversationId"`
	SenderID       string              `bson:"senderId" json:"senderId"`
	Content        string              `bson:"content" json:"content"`
	AttachmentUrl  string              `bson:"attachmentUrl" json:"attachmentUrl"`
	Type           string              `bson:"type" json:"type"` // e.g., "text", "image", "file"
	ReplyTo        *primitive.ObjectID `bson:"replyTo,omitempty" json:"replyTo,omitempty"`
	CreatedAt      time.Time           `bson:"createdAt" json:"createdAt"`
}
