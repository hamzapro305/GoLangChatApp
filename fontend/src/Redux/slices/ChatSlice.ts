import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatLoadingMessage, ChatMessage, Conversation } from "../../@types/chat";

export type SingleChatT = {
    conversation: Conversation;
    messages: ChatMessage[];
    unReadMessages: ChatMessage[];
    sendingMessages: ChatLoadingMessage[]
    isMessageFetched: boolean;
};

type initChatSlice = {
    conversations: SingleChatT[];
    selectedChat: string | null;
};

const initialState: initChatSlice = {
    conversations: [],
    selectedChat: null,
};

export const Slice = createSlice({
    name: "Chat",
    initialState,
    reducers: {
        setAllConversations: (
            state,
            { payload }: PayloadAction<initChatSlice["conversations"]>
        ) => {
            state.conversations = payload;
        },
        addNewConversation: (
            state,
            { payload }: PayloadAction<initChatSlice["conversations"][0]>
        ) => {
            state.conversations.push(payload);
        },
        setSelectedChat: (state, { payload }: PayloadAction<string>) => {
            state.selectedChat = payload;
        },
        newMessage: (state, { payload }: PayloadAction<ChatMessage>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    const isMessageAlreadyInIt = conv.messages.find(
                        (msg) => msg.id == payload.id
                    );
                    if (isMessageAlreadyInIt == undefined) {
                        conv.messages.push(payload);
                        conv.unReadMessages.push(payload);
                    }
                }
            });
        },
        readMessages: (state, { payload }: PayloadAction<string>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload) {
                    conv.unReadMessages = [];
                }
            });
        },
        setMessages: (
            state,
            action: PayloadAction<{ convId: string; messages: ChatMessage[] }>
        ) => {
            const { convId, messages } = action.payload;
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == convId) {
                    conv.messages = messages;
                }
            });
        },
        setIsMessagesFetched: (state, { payload }: PayloadAction<string>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload) {
                    conv.isMessageFetched = true;
                }
            });
        },
        addNewMeesageToSending: (state, { payload }: PayloadAction<{ message: ChatLoadingMessage, conversationId: string }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.sendingMessages.push(payload.message);
                }
            });
        },
        removeMeesageToSending: (state, { payload }: PayloadAction<{ tempId: string, conversationId: string }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.sendingMessages.forEach((msg, index) => {
                        console.log(msg.tempId, payload.tempId)
                        if (msg.tempId == payload.tempId) {
                            conv.sendingMessages.splice(index, 1);
                        }
                    });
                }
            });
        },
        setMessageStatusToSending: (state, { payload }: PayloadAction<{ tempId: string, conversationId: string, status: "loading" | "failed" }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.sendingMessages.forEach((msg) => {
                        if (msg.tempId == payload.tempId) {
                            msg.status = payload.status;
                        }
                    });
                }
            });
        }
    },
});

// Action creators are generated for each case reducer function
export const ChatActions = Slice.actions;

export default Slice.reducer;
