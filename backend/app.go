package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/hamzapro305/GoLangChatApp/src/middlewares"
	"github.com/hamzapro305/GoLangChatApp/src/routes"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Cannot load env variables.")
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024,
	})

	app.Use(cors.New())

	middlewares.SetupMiddlewares(app)

	// Setup Routes
	routes.SetupRoutes(app)
	app.Static("/uploads", "./uploads")

	port := os.Getenv("GATEWAY_PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen(":" + port))
}
