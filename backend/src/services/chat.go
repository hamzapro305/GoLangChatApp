package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
)

type conversationWebSocketService struct{}

var ConversationWebSocketService = &conversationWebSocketService{}

// Active WebSocket Connections (userID -> WebSocket connection)
var activeConversationConnections = make(map[string]*websocket.Conn)
var mu sync.Mutex // For thread safety

// Function to Add WebSocket Connection
func (*conversationWebSocketService) AddConnection(userID string, conn *websocket.Conn) {
	mu.Lock()
	defer mu.Unlock()
	activeConversationConnections[userID] = conn

	// Sync user conversations initially
	go ConversationWebSocketService.SyncUserConversations(userID, conn)
}

// Function to Remove WebSocket Connection
func (*conversationWebSocketService) RemoveConnection(userID string) {
	mu.Lock()
	defer mu.Unlock()
	delete(activeConversationConnections, userID)
}

// Notify only the participants about the new conversation
func (*conversationWebSocketService) SendNewConversationMessage(conv models.Conversation, createdByParticipantId string) {
	message, err := json.Marshal(map[string]interface{}{
		"type":         "new_conversation",
		"conversation": conv,
	})
	if err != nil {
		log.Println("Error marshalling notification:", err)
		return
	}

	var wg sync.WaitGroup // Wait group to track Goroutines

	for _, participant := range conv.Participants {
		participantId := participant.UserID

		if participantId == createdByParticipantId {
			continue // Skip sender
		}

		mu.Lock()
		conn, exists := activeConversationConnections[participantId]
		mu.Unlock()

		if exists {
			wg.Add(1) // Increment wait group for each Goroutine

			go func(participantId string, conn *websocket.Conn) {
				// Mark this Goroutine as completed
				defer wg.Done()

				log.Println("Notifying participant:", participantId, "About Conversation:", conv.ID.Hex(), "Created")
				conn.WriteMessage(websocket.TextMessage, message)

			}(participantId, conn)
		}
	}
	wg.Wait()
}

// Notify only the participants about the new message in conversation
func (*conversationWebSocketService) SendNewMessageInConversationMessage(msg models.Message) {
	message, err := json.Marshal(map[string]interface{}{
		"type":    "new_message_in_conversation",
		"message": msg,
	})
	if err != nil {
		log.Println("Error marshalling notification:", err)
		return
	}

	conv, err := ConversationService.GetConversationById(msg.ConversationID)

	if err != nil {
		log.Println("Error Getting Conversation:", err)
		return
	}

	var wg sync.WaitGroup

	for _, participant := range conv.Participants {
		participantId := participant.UserID
		if participantId == msg.SenderID {
			continue
		}

		mu.Lock()
		conn, exists := activeConversationConnections[participantId]
		mu.Unlock()

		if exists {
			wg.Add(1)
			go func(participantId string, conn *websocket.Conn) {
				defer wg.Done()
				log.Println("Notifying participant:", participantId, "About Message in Conversation:", conv.ID.Hex(), "Created")
				conn.WriteMessage(websocket.TextMessage, message)
			}(participantId, conn)
		}
	}
	wg.Wait()
}

// Send initial conversation data to the user
func (*conversationWebSocketService) SyncUserConversations(userID string, conn *websocket.Conn) {
	conversations, err := repos.ConversationRepo.GetUserConversations(userID)
	if err != nil {
		log.Println("Error fetching user conversations:", err)
		return
	}

	message, err := json.Marshal(map[string]interface{}{
		"type":          "sync_conversations",
		"conversations": conversations,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	mu.Lock()
	if conn, exists := activeConversationConnections[userID]; exists {
		conn.WriteMessage(websocket.TextMessage, message)
	}
	mu.Unlock()
}
