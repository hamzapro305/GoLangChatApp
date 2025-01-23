package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
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
