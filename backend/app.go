package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
	"github.com/hamzapro305/GoLangChatApp/src/routes"
)

func main() {

	config.ConnectDB()

	app := fiber.New()

	app.Use(cors.New())

	middlewares.SetupMiddlewares(app)

	routes.SetupRoutes(app)

	app.Listen(":3001")
}
