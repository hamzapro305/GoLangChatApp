package models

import "time"

type Message struct {
	ID             string    `bson:"_id,omitempty"`
	ConversationID string    `bson:"conversationId"`
	SenderID       string    `bson:"senderId"`
	Content        string    `bson:"content"`
	CreatedAt      time.Time `bson:"createdAt"`
}
