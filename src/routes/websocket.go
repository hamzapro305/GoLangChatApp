package routes

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
)

func webSocketRoute(webRoute fiber.Router) {
	webRoute.Get("/ws/:id", websocket.New(controllers.HandleWebSocket))
}
