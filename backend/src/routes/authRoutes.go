package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
)

func setupAuthRoutes(auth fiber.Router) {
	auth.Post("/register", controllers.AuthController.Register)
	auth.Post("/login", controllers.AuthController.Login)
}
