import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatMessage, Conversation } from "../../@types/chat";

export type SingleChatT = {
    conversation: Conversation;
    messages: ChatMessage[];
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
                    }
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
    },
});

// Action creators are generated for each case reducer function
export const ChatActions = Slice.actions;

export default Slice.reducer;
