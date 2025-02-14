package config

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

var StorageClient *storage.Client
var BucketName = "your-bucket-name"

func InitFirebase() error {
	ctx := context.Background()
	client, err := storage.NewClient(ctx, option.WithCredentialsFile("election-app-service-account-key.json"))

	if err != nil {
		log.Fatalf("Failed to initialize Firebase Storage: %v", err)
		return err
	}
	
	StorageClient = client
	fmt.Println("Firebase Storage Initialized!")
	return nil
}
