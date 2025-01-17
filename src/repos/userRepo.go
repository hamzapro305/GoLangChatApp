package repos

import (
	"context"

	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	filter := bson.M{"email": email}
	var user models.User
	err := models.UserCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.UserCollection.InsertOne(ctx, user)
	return err

}
