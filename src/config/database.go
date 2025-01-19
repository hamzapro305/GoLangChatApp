package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() error {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://admin:admin@localhost:27017/"
	}

	fmt.Println("Connecting to MongoDB", mongoURI)

	// Create a new MongoDB client and connect to the database
	Client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
		return err
	}

	// Set the user collection
	models.UserCollection = Client.Database("auth-db").Collection("users")

	// Set the conversation collection
	models.ConversationCollection = Client.Database("conversation-db").Collection("conversations")

	// Set Participant collection
	models.ConversationCollection = Client.Database("conversation-db").Collection("conversations")

	fmt.Println("Connected to MongoDB")
	return nil
}
