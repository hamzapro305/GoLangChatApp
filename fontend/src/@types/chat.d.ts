type Participant = {
    userId: string
    joinedAt: string
    leftAt: string
}

type SimpleConversation = {
    id: string
    participants: Participant[]
    isGroup: false,
    createdAt: string
    leader: string
}
type GroupConversation = {
    id: string
    participants: Participant[]
    isGroup: true,
    createdAt: string
    leader: string
    groupName: string
}
type Conversation = SimpleConversation | GroupConversation

type SyncConversationMessage = {
    type: "sync_conversations";
    conversations: Conversation[];
    message: string;
};

type ConversationCreationCompleteMessage = {
    type: "new_conversation";
    conversation: Conversation;
    message: string;
};

type NewMessageInConversationMessage = {
    type: "new_message_in_conversation"
    message: ChatMessage
}

type ChatMessage = {
    id: string
    conversationId: string
    senderId: string
    content: string
    createdAt: string
}

type WebSocketMessage = SyncConversationMessage | ConversationCreationCompleteMessage | NewMessageInConversationMessage

export {
    ChatMessage,

    Conversation,
    Participant,

    WebSocketMessage,
    SyncConversationMessage,
    ConversationCreationCompleteMessage,
    NewMessageInConversationMessage
}