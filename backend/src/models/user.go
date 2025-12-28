package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name       string             `bson:"name" json:"name"`
	Email      string             `bson:"email" json:"email"`
	Password   []byte             `bson:"password" json:"-"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	ProfilePic string             `bson:"profilePic" json:"profilePic"`
}
