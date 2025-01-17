package repos

import (
	"context"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetUserByEmail(email string) (*models.User, error) {
	filter := bson.M{"email": email}
	var user models.User
	err := models.UserCollection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(user models.User) error {
	_, err := models.UserCollection.InsertOne(context.TODO(), user)
	return err
}
