package services

import (
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type userService struct{}

var UserService = &userService{}

func (*userService) AddUser(name string, email string, password string) (*models.User, error) {
	var result struct {
		User models.User `json:"user"`
	}

	body := map[string]string{
		"name":     name,
		"email":    email,
		"password": password,
	}

	err := utils.AuthServiceClient.Post("/users", body, &result)
	return &result.User, err
}

func (*userService) GetUser(email string) (*models.User, error) {
	var result struct {
		User models.User `json:"user"`
	}

	err := utils.AuthServiceClient.Get("/users/email/"+email, &result)
	return &result.User, err
}

func (*userService) GetUserById(id string) (*models.User, error) {
	var result struct {
		User models.User `json:"user"`
	}

	err := utils.AuthServiceClient.Get("/users/"+id, &result)
	return &result.User, err
}

func (*userService) GetAllUsers() ([]models.User, error) {
	var result struct {
		Users []models.User `json:"users"`
	}

	err := utils.AuthServiceClient.Get("/users", &result)
	return result.Users, err
}

func ValidateUser(email string, password string) (*models.User, error) {
	var result struct {
		User models.User `json:"user"`
	}

	body := map[string]string{
		"email":    email,
		"password": password,
	}

	err := utils.AuthServiceClient.Post("/auth/validate", body, &result)
	if err != nil {
		return nil, err
	}

	return &result.User, nil
}

func (*userService) UpdateUserName(userID string, newName string) error {
	body := map[string]string{"name": newName}
	return utils.AuthServiceClient.Post("/users/"+userID+"/update-name", body, nil)
}

func (*userService) UpdatePassword(userID string, newPassword string) error {
	body := map[string]string{"password": newPassword}
	return utils.AuthServiceClient.Post("/users/"+userID+"/update-password", body, nil)
}
