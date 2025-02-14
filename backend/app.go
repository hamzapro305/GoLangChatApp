package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/hamzapro305/GoLangChatApp/src/config"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
	"github.com/hamzapro305/GoLangChatApp/src/routes"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Cannot load env variables.")
	}

	config.ConnectDB()
	config.InitFirebase()

	app := fiber.New()

	app.Use(cors.New())

	middlewares.SetupMiddlewares(app)

	routes.SetupRoutes(app)

	app.Listen(":3001")
}
