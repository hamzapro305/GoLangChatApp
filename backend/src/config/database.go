package config

import (
	"context"
	"fmt"
	"os"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"go.mongodb.org/mongo-driver/bson"
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
		panic(err)
	}

	var result bson.M
	if err := Client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	// Set the user collection
	models.UserCollection = Client.Database("auth-db").Collection("users")

	// Set the conversation collection
	models.ConversationCollection = Client.Database("conversation-db").Collection("conversations")

	// Set the message collection
	models.MessageCollection = Client.Database("conversation-db").Collection("messages")

	return nil
}
