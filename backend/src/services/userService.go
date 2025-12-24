package services

import (
	"fmt"
	"time"

	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type userService struct{}

var UserService = &userService{}

func (*userService) AddUser(name string, email string, password string) (*models.User, error) {
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
		Name:      name,
		CreatedAt: time.Now(),
	}
	err = repos.UserRepo.CreateUser(newUser)
	return &newUser, err
}

func (*userService) GetUser(email string) (*models.User, error) {
	user, err := repos.UserRepo.GetUserByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (*userService) GetUserById(id string) (*models.User, error) {
	user, err := repos.UserRepo.GetUserById(id)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (*userService) GetAllUsers() ([]models.User, error) {
	users, err := repos.UserRepo.GetAllUsers()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func ValidateUser(email string, password string) (*models.User, error) {
	// Fetch user by email
	user, err := UserService.GetUser(email)
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

func (*userService) UpdateUserName(userID string, newName string) error {
	return repos.UserRepo.UpdateUserName(userID, newName)
}

func (*userService) UpdatePassword(userID string, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.MinCost)
	if err != nil {
		return err
	}
	return repos.UserRepo.UpdatePassword(userID, hashedPassword)
}
