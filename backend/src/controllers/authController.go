package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/services"
	"github.com/hamzapro305/GoLangChatApp/src/utils"
)

type authController struct{}

var AuthController = &authController{}

type registerBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

func (*authController) Register(c *fiber.Ctx) error {
	// Parse JSON body into struct
	body, parseError := utils.ParseBody[registerBody](c)
	if parseError != nil {
		return parseError
	}

	_, err := services.UserService.GetUser(body.Email)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User already exists",
		})
	}

	newUser, err := services.UserService.AddUser(body.Name, body.Email, body.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create user",
		})
	}

	token, err := services.JwtService.CreateToken(body.Email, body.Password, newUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not login",
		})
	}

	return c.JSON(fiber.Map{
		"token": token,
	})
}

func (*authController) Login(c *fiber.Ctx) error {
	// Parse JSON body into struct
	body, parseError := utils.ParseBody[registerBody](c)
	if parseError != nil {
		return parseError
	}
	user, err := services.ValidateUser(body.Email, body.Password)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User Validation Failed",
		})
	}

	token, err := services.JwtService.CreateToken(body.Email, body.Password, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not login",
		})
	}

	return c.JSON(fiber.Map{
		"token": token,
	})
}
