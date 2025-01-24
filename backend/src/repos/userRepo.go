package repos

import (
	"context"
	"fmt"

	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type userRepo struct{}

var UserRepo = &userRepo{}

func (*userRepo) GetUserByEmail(email string) (*models.User, error) {
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

func (*userRepo) GetUserById(id string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	userId, conversionError := primitive.ObjectIDFromHex(id)
	if conversionError != nil {
		return nil, conversionError
	}

	filter := bson.M{"_id": userId}
	var user models.User
	err := models.UserCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (*userRepo) GetAllUsers() ([]models.User, error) {
	// Get all conversations for a user ID
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	// Define the projection to fetch only required fields
	projection := bson.M{
		"_id":       1,
		"name":      1,
		"email":     1,
		"createdAt": 1,
	}

	options := options.Find().SetProjection(projection)

	cursor, err := models.UserCollection.Find(ctx, bson.M{}, options)
	if err != nil {
		fmt.Println("Error finding users:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		fmt.Println("Error decoding users:", err)
		return nil, err
	}

	// Ensure we return an empty slice instead of nil
	if users == nil {
		return []models.User{}, nil
	}

	return users, nil
}

func (*userRepo) CreateUser(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), config.DatabaseTimeLimit)
	defer cancel()

	_, err := models.UserCollection.InsertOne(ctx, user)
	return err

}
