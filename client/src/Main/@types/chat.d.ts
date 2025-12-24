type Participant = {
    userId: string;
    joinedAt: string;
    leftAt: string;
};

export type SimpleConversation = {
    id: string;
    participants: Participant[];
    isGroup: false;
    createdAt: string;
    leader: string;
};
export type GroupConversation = {
    id: string;
    participants: Participant[];
    isGroup: true;
    createdAt: string;
    leader: string;
    groupName: string;
};
type Conversation = SimpleConversation | GroupConversation;

type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type?: "text" | "image" | "video" | "file";
    createdAt: string;
};

type ChatNewMessage = {
    tempId: string
    status: "loading" | "failed" | "sent";
    conversationId: string;
    senderId: string;
    content: string;
    type?: "text" | "image" | "video" | "file";
};

export {
    ChatMessage,
    Conversation,
    Participant,
    ChatNewMessage
};
