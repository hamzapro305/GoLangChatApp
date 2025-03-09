package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/models"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
)

type conversationWebSocketService struct{}

var ConversationWebSocketService = &conversationWebSocketService{}

type UserConnection struct {
	Conn *websocket.Conn
	Mu   *sync.Mutex
}

// Active WebSocket Connections (userID -> WebSocket connection)
var activeConversationConnections = make(map[string]UserConnection)
var mu sync.Mutex // For thread safety

// Function to Add WebSocket Connection
func (*conversationWebSocketService) AddConnection(userID string, conn *websocket.Conn) {
	mu.Lock()
	var userConnection = UserConnection{Conn: conn, Mu: &sync.Mutex{}}
	activeConversationConnections[userID] = userConnection
	mu.Unlock()

	// Sync user conversations initially
	go ConversationWebSocketService.SyncUserConversations(userID, &userConnection)
}

// Function to Remove WebSocket Connection
func (*conversationWebSocketService) RemoveConnection(userID string) {
	mu.Lock()
	delete(activeConversationConnections, userID)
	mu.Unlock()
}

// Notify only the participants about the new conversation
func (*conversationWebSocketService) SendNewConversationMessage(conv models.Conversation, createdByParticipantId string) {
	message, err := json.Marshal(fiber.Map{
		"type":         "new_conversation",
		"conversation": conv,
	})
	if err != nil {
		log.Println("Error marshalling notification:", err)
		return
	}
	go ConversationWebSocketService.SendMessageToParticipants(message, conv.Participants, func(participantId string) bool {
		return participantId == createdByParticipantId
	})
}

// Notify only the participants about the new group conversation
func (*conversationWebSocketService) SendNewGroupConversationMessage(conv models.GroupConversation, createdByParticipantId string) {
	message, err := json.Marshal(fiber.Map{
		"type":         "new_conversation",
		"conversation": conv,
	})
	if err != nil {
		log.Println("Error marshalling notification:", err)
		return
	}
	go ConversationWebSocketService.SendMessageToParticipants(message, conv.Participants, func(participantId string) bool {
		return participantId == createdByParticipantId
	})
}

// Notify only the participants about the new message in conversation
func (*conversationWebSocketService) SendNewMessageInConversationMessage(msg models.Message) {
	message, err := json.Marshal(fiber.Map{
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

	go ConversationWebSocketService.SendMessageToParticipants(message, conv.Participants, func(participantId string) bool {
		return participantId == msg.SenderID
	})
}

// Send initial conversation data to the user
func (*conversationWebSocketService) SyncUserConversations(userID string, userConnection *UserConnection) {
	conversations, err := repos.ConversationRepo.GetUserConversations(userID)
	if err != nil {
		log.Println("Error fetching user conversations:", err)
		return
	}

	transformedConversations := ConversationArrayTransformation(conversations)

	message, err := json.Marshal(fiber.Map{
		"type":          "sync_conversations",
		"conversations": transformedConversations,
	})
	if err != nil {
		log.Println("Error marshalling conversation data:", err)
		return
	}

	userConnection.Mu.Lock()
	userConnection.Conn.WriteMessage(websocket.TextMessage, message)
	userConnection.Mu.Unlock()
}

// Send Participant Message
func (*conversationWebSocketService) SendMessageToParticipants(message []byte, participants []models.Participant, skipMessage func(participantId string) bool) {
	var wg sync.WaitGroup // Wait group to track Goroutines
	for _, participant := range participants {
		participantId := participant.UserID
		if skipMessage(participantId) {
			continue
		}
		mu.Lock()
		conn, exists := activeConversationConnections[participantId]
		mu.Unlock()

		if exists {
			wg.Add(1)
			go func(conn *UserConnection) {
				defer wg.Done()
				conn.Mu.Lock()
				defer conn.Mu.Unlock()
				conn.Conn.WriteMessage(websocket.TextMessage, message)
			}(&conn)
		}
	}
	wg.Wait()
}

func ConversationArrayTransformation(conversations []models.GroupConversation) []interface{} {
	var convs []interface{}
	for _, conv := range conversations {
		// Create a map to hold the common fields
		convInfo := fiber.Map{
			"id":           conv.ID,
			"participants": conv.Participants,
			"createdAt":    conv.CreatedAt,
			"leader":       conv.Leader,
			"isGroup":      conv.IsGroup,
		}

		// Add GroupName only if it's a group conversation
		if conv.IsGroup {
			convInfo["groupName"] = conv.GroupName // `bson:"groupName" json:"groupName"`
		}

		convs = append(convs, convInfo)
	}
	return convs
}
