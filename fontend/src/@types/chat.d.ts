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
export type GroupConversation = SimpleConversation & {
    groupName: string;
};
type Conversation = SimpleConversation | GroupConversation;

type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
};

type ChatLoadingMessage = Pick<ChatMessage, "conversationId" | "content"> & {
    tempId: string
    status: "loading" | "failed";
};

export {
    ChatMessage,
    Conversation,
    Participant,
    ChatLoadingMessage
};
