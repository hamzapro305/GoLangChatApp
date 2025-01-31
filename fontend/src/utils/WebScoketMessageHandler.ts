import { AppDispatch } from "../Redux/store";
import { ChatActions, ChatSliceT } from "../Redux/slices/ChatSlice";
import {
    ConversationCreationCompleteMessage,
    ConversationCreationDoneMessage,
    MessageCreationDoneMessage,
    NewMessageInConversationMessage,
    SyncConversationMessage,
    WebSocketMessage,
} from "../@types/socket";
import { User } from "../Redux/slices/GlobalVars";

type Data = {
    user: User,
    chat: ChatSliceT
}

export class WebSocketInComingMessageHanlder {
    static BasicMessageHandler(
        message: WebSocketMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        switch (message.type) {
            case "sync_conversations":
                WebSocketInComingMessageHanlder.syncConversation(
                    message,
                    dispatch,
                    data
                );
                break;
            case "new_conversation":
                WebSocketInComingMessageHanlder.newConversation(
                    message,
                    dispatch,
                    data
                );
                break;
            case "new_message_in_conversation":
                WebSocketInComingMessageHanlder.newMessage(
                    message,
                    dispatch,
                    data
                );
                break;
            case "action_message_creation_done":
                WebSocketInComingMessageHanlder.messageCreationDone(
                    message,
                    dispatch,
                    data
                );
                break;
            case "conversation_creation_completed":
                WebSocketInComingMessageHanlder.conversationCreationDone(
                    message,
                    dispatch,
                    data
                );
                break;
            default:
                console.log("Unknown Message", message);
                break;
        }
    }
    static newConversation(
        message: ConversationCreationCompleteMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        console.log("Create Conversation Message", message);

        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                unReadMessages: [],
                isMessageFetched: false,
                newMessages: []
            })
        );
    }
    static syncConversation(
        message: SyncConversationMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        console.log("Sync Conversation Message", message);
        dispatch(
            ChatActions.setAllConversations(
                message.conversations.map((conv) => ({
                    conversation: conv,
                    messages: [],
                    unReadMessages: [],
                    isMessageFetched: false,
                    newMessages: []
                }))
            )
        );
    }
    static newMessage(
        message: NewMessageInConversationMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        console.log("New Message", message);
        dispatch(
            ChatActions.newMessageInChat({
                message: message.message,
                tempId: message.message.id,
            })
        );
    }
    static messageCreationDone(
        message: MessageCreationDoneMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        console.log("New Message", message);
        if (message.type === "error") {
            dispatch(
                ChatActions.setMessageStatusToSending({
                    conversationId: message.conversationId,
                    tempId: message.tempId,
                    status: "failed"
                })
            );
        } else {
            dispatch(
                ChatActions.newMessageInChat({
                    message: message.message,
                    tempId: message.tempId,
                })
            );
        }
    }
    static conversationCreationDone(
        message: ConversationCreationDoneMessage,
        dispatch: AppDispatch,
        data: Data,
    ) {
        console.log("New Conversation", message);
        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                unReadMessages: [],
                isMessageFetched: false,
                newMessages: []
            })
        );
    }
}
