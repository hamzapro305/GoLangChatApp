package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type userController struct{}

var UserController = &userController{}

func (*userController) GetUsers(c *fiber.Ctx) error {
	users, err := services.UserService.GetAllUsers()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cant get all users",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"users": users,
	})
}

func (*userController) GetCurrentUser(c *fiber.Ctx) error {
	claims, _ := services.JwtService.GetClaims(c)

	user, err := services.UserService.GetUser(claims.Email)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot Get user",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": user,
	})
}

type getUserBody struct {
	UserId string `json:"userId"`
}

func (*userController) GetUserById(c *fiber.Ctx) error {
	// Parse JSON body into struct
	body, parseError := utils.ParseBody[getUserBody](c)
	if parseError != nil {
		return parseError
	}
	user, err := services.UserService.GetUserById(body.UserId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot Get user",
		})
	}
	fmt.Println("Getting User:", user.Email)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": user,
	})
}
