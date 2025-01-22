package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Conversation struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Participants []Participant      `bson:"participants" json:"participants"`
	IsGroup      bool               `bson:"isGroup" json:"isGroup"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	Leader       string             `bson:"leaderId" json:"leaderId"`
}

type Participant struct {
	UserID   string    `bson:"userId" json:"userId"`
	JoinedAt time.Time `bson:"joinedAt" json:"joinedAt"`
	LeftAt   time.Time `bson:"leftAt,omitempty" json:"leftAt,omitempty"`
}

var ConversationCollection *mongo.Collection

var ParticipantCollection *mongo.Collection
