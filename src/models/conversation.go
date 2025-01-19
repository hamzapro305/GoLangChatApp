package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Conversation struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Participants []Participant      `bson:"participants"`
	IsGroup      bool               `bson:"isGroup"`
	CreatedAt    time.Time          `bson:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt"`
}

type Participant struct {
	UserID   primitive.ObjectID `bson:"userId"`
	JoinedAt time.Time          `bson:"joinedAt"`
	LeftAt   time.Time          `bson:"leftAt,omitempty"`
}

var ConversationCollection *mongo.Collection

var ParticipantCollection *mongo.Collection
