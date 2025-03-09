package routes

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/config"
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
				// 1. Convert message into JSON object
				var messageData map[string]interface{}
				err := json.Unmarshal(msg, &messageData)
				if err != nil {
					log.Println("Invalid JSON format:", err)
					continue
				}

				// 2. Add current_user_id field
				messageData["current_user_id"] = userClaims.UserID

				// 3. Convert modified message back to JSON string
				modifiedMsg, err := json.Marshal(messageData)
				if err != nil {
					log.Println("Failed to encode message:", err)
					continue
				}
				// 5. Publish modified message ID to Redis
				err = config.PublishMessage("chat_channel", string(modifiedMsg))
				if err != nil {
					log.Println("Failed to publish message to Redis:", err)
				}

			case websocket.BinaryMessage:
				log.Println("Binary messages are not supported")
			default:
				log.Println("Unsupported message type:", messageType)
			}
		}
	}))
	go config.SubscribeMessages("chat_channel", func(message string) {
		fmt.Println(message)
		controllers.WebSocketMessageHandler.WebSocketMessageHandler([]byte(message))
	})

}
