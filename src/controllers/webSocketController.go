package controllers

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/services"
)

func HandleWebSocket(c *websocket.Conn) {
	claims, err := services.JwtService.GetSocketClaims(c)
	if err != nil {
		services.ConversationWebSocketService.RemoveConnection(claims.UserID)
		c.Close()
	}

	// Add User Connection
	services.ConversationWebSocketService.AddConnection(claims.UserID, c)
	log.Println("User connected:", claims.Email)

	defer func() {
		services.ConversationWebSocketService.RemoveConnection(claims.UserID)
		c.Close()
		log.Println("User disconnected:", claims.Email)
	}()

	// Keep connection alive
	for {
		messageType, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		log.Println("Received message:", string(msg))

		// Handle message based on type (text, binary, etc.)
		switch messageType {
		case websocket.TextMessage:
			log.Println("Received message type:", messageType)
			// handleTextMessage(claims.UserID, msg)
		case websocket.BinaryMessage:
			log.Println("Binary messages are not supported")
		default:
			log.Println("Unsupported message type:", messageType)
		}

	}

}
