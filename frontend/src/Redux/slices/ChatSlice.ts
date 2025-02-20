import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatNewMessage, ChatMessage, Conversation } from "../../@types/chat";

export type SingleChatT = {
    conversation: Conversation;
    messages: ChatMessage[];
    unReadMessages: ChatMessage[];
    newMessages: ChatNewMessage[]
    isMessageFetched: boolean;


};

type SelectedChatT = {
    id: string
    emojiModal: boolean
    messageOptions: string | null
    chatInfo: boolean
}


export type ChatSliceT = {
    conversations: SingleChatT[];
    selectedChat: SelectedChatT | null;
};

const initialState: ChatSliceT = {
    conversations: [],
    selectedChat: null,
};

export const Slice = createSlice({
    name: "Chat",
    initialState,
    reducers: {
        setAllConversations: (
            state,
            { payload }: PayloadAction<ChatSliceT["conversations"]>
        ) => {
            state.conversations = payload;
        },
        addNewConversation: (
            state,
            { payload }: PayloadAction<ChatSliceT["conversations"][0]>
        ) => {
            state.conversations.push(payload);
        },
        setSelectedChat: (
            state,
            { payload }: PayloadAction<Partial<SelectedChatT> | null>
        ) => {
            if (payload == null) {
                state.selectedChat = null
            }
            else {
                state.selectedChat = {
                    ...state.selectedChat,
                    ...payload
                } as SelectedChatT;
            }
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
        addNewMeesageToSending: (state, { payload }: PayloadAction<{ message: ChatNewMessage, conversationId: string }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.newMessages.push(payload.message);
                }
            });
        },
        removeMeesageToSending: (state, { payload }: PayloadAction<{ tempId: string, conversationId: string }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.newMessages.forEach((msg, index) => {
                        console.log(msg.tempId, payload.tempId)
                        if (msg.tempId == payload.tempId) {
                            conv.newMessages.splice(index, 1);
                        }
                    });
                }
            });
        },
        setMessageStatusToSending: (state, { payload }: PayloadAction<{ tempId: string, conversationId: string, status: ChatNewMessage["status"] }>) => {
            state.conversations.forEach((conv) => {
                if (conv.conversation.id == payload.conversationId) {
                    conv.newMessages.forEach((msg) => {
                        if (msg.tempId == payload.tempId) {
                            msg.status = payload.status;
                        }
                    });
                }
            });
        },
        newMessageInChat: (
            state,
            { payload }: PayloadAction<{ message: ChatMessage, tempId: string }>
        ) => {
            const { message, tempId } = payload
            state.conversations.forEach(conv => {
                if (conv.conversation.id === message.conversationId) {
                    const element = conv.newMessages.filter(element => element.tempId == tempId)
                    if (element.length) {
                        conv.newMessages.forEach((msg) => {
                            if (msg.tempId == payload.tempId) {
                                msg.status = "sent";
                            }
                        });
                    } else {
                        conv.newMessages.push({
                            ...message,
                            tempId: tempId,
                            status: "sent"
                        });
                    }
                }
            })
        }
    },
});

// Action creators are generated for each case reducer function
export const ChatActions = Slice.actions;

export default Slice.reducer;
