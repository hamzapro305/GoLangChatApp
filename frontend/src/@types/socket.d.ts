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
    type: "new_message_in_conversation";
    message: ChatMessage;
};
type MessageCreationDoneMessage = {
    type: "action_message_creation_done";
    message: ChatMessage;
    conversationId: string;
    tempId: string
} | {
    type: "error";
    message: string;
    conversationId: string;
    tempId: string;
};
type ConversationCreationDoneMessage = {
    type: "conversation_creation_completed";
    message: string;
    conversation: Conversation;
};
type SetUserTypingMessage = {
    type: "user_started_typing";
    user_id: string;
    conversation_id: string
}
type SetUserStopTypingMessage = {
    type: "user_stopped_typing";
    user_id: string;
    conversation_id: string
}

type WebSocketMessage =
    | MessageCreationDoneMessage
    | SyncConversationMessage
    | ConversationCreationCompleteMessage
    | NewMessageInConversationMessage
    | ConversationCreationDoneMessage
    | SetUserTypingMessage
    | SetUserStopTypingMessage

export {
    WebSocketMessage,
    SyncConversationMessage,
    ConversationCreationCompleteMessage,
    NewMessageInConversationMessage,
    MessageCreationDoneMessage,
    ConversationCreationDoneMessage,
    SetUserTypingMessage,
    SetUserStopTypingMessage
}