package models

import "time"

type Conversation struct {
	ID           string        `bson:"_id,omitempty"`
	Participants []Participant `bson:"participants"`
	CreatedAt    time.Time     `bson:"createdAt"`
	UpdatedAt    time.Time     `bson:"updatedAt"`
}

type Participant struct {
	UserID   string     `bson:"userId"`
	JoinedAt time.Time  `bson:"joinedAt"`
	LeftAt   *time.Time `bson:"leftAt,omitempty"`
}
