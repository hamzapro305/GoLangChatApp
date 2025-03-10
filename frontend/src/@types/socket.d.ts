import { ChatMessage } from "./chat";

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
    | SyncConversationMessage
    | ConversationCreationCompleteMessage
    | NewMessageInConversationMessage
    | SetUserTypingMessage
    | SetUserStopTypingMessage

export {
    WebSocketMessage,
    SyncConversationMessage,
    ConversationCreationCompleteMessage,
    NewMessageInConversationMessage,
    SetUserTypingMessage,
    SetUserStopTypingMessage
}