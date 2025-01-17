package services

import (
	"fmt"
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func AddUser(email string, password string) error {
	// encrupt pass
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		panic(err)
	}

	// Add user to database
	newUser := models.User{
		ID:        primitive.NewObjectID(),
		Email:     email,
		Password:  hashedPassword,
		Name:      "",
		CreatedAt: time.Now(),
	}
	err = repos.CreateUser(newUser)
	return err
}

func GetUser(email string) (*models.User, error) {
	user, err := repos.GetUserByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil

}

func ValidateUser(email string, password string) (*models.User, error) {
	// Fetch user by email
	user, err := GetUser(email)
	if err != nil {
		return nil, fmt.Errorf("user not found") // Return an error, not an HTTP response
	}

	// Compare hashed password
	err = bcrypt.CompareHashAndPassword(user.Password, []byte(password))
	if err != nil {
		return nil, fmt.Errorf("password incorrect") // Return an error, not an HTTP response
	}

	// Return the user if everything is fine
	return user, nil
}
