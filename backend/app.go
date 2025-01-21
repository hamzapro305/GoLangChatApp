package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
	"github.com/hamzapro305/GoLangChatApp/src/routes"
)

func main() {

	config.ConnectDB()

	app := fiber.New()

	middlewares.SetupMiddlewares(app)

	routes.SetupRoutes(app)

	app.Listen(":3000")
}
