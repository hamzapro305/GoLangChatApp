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
	log.Println("User connected:", claims.UserID)

	defer func() {
		services.ConversationWebSocketService.RemoveConnection(claims.UserID)
		c.Close()
		log.Println("User disconnected:", claims.UserID)
	}()

	// Keep connection alive
	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}

}
