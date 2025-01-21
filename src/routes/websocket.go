package routes

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

func webSocketRoute(webRoute fiber.Router) {
	webRoute.Get("/ws/conversation", websocket.New(func(c *websocket.Conn) {
		userClaims, err := services.JwtService.GetSocketClaims(c)
		if err != nil {
			services.ConversationWebSocketService.RemoveConnection(userClaims.UserID)
			c.Close()
		}

		// Add User Connection
		services.ConversationWebSocketService.AddConnection(userClaims.UserID, c)
		log.Println("User connected:", userClaims.Email)

		defer func() {
			services.ConversationWebSocketService.RemoveConnection(userClaims.UserID)
			c.Close()
			log.Println("User disconnected:", userClaims.Email)
		}()

		// Keep connection alive
		for {
			messageType, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				break
			}

			switch messageType {
			case websocket.TextMessage:
				controllers.WebSocketMessageHandler.WebSocketMessageHandler(c, userClaims, msg)
			case websocket.BinaryMessage:
				log.Println("Binary messages are not supported")
			default:
				log.Println("Unsupported message type:", messageType)
			}
		}
	}))
}
