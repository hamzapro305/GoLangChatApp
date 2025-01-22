import { ChatMessage, Conversation } from "@/@types/chat";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initChatSlice = {
    conversations: {
        conversation: Conversation,
        messages: ChatMessage[]
    }[]
};

const initialState: initChatSlice = {
    conversations: []
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
            state.conversations.push(payload)
        },
        newMessage: (
            state,
            { payload }: PayloadAction<ChatMessage>
        ) => {
            state.conversations.forEach(conv => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.messages.push(payload)
                }
            })
        }
    },
});

// Action creators are generated for each case reducer function
export const ChatActions = Slice.actions;

export default Slice.reducer;
