import { AppDispatch } from "../Redux/store";
import { ChatActions } from "../Redux/slices/ChatSlice";
import {
    ConversationCreationCompleteMessage,
    ConversationCreationDoneMessage,
    MessageCreationDoneMessage,
    NewMessageInConversationMessage,
    SyncConversationMessage,
    WebSocketMessage,
} from "../@types/socket";
import { User } from "../Redux/slices/GlobalVars";

export class WebSocketInComingMessageHanlder {
    static BasicMessageHandler(
        message: WebSocketMessage,
        dispatch: AppDispatch,
        user: User
    ) {
        switch (message.type) {
            case "sync_conversations":
                WebSocketInComingMessageHanlder.syncConversation(
                    message,
                    dispatch,
                    user
                );
                break;
            case "new_conversation":
                WebSocketInComingMessageHanlder.newConversation(
                    message,
                    dispatch,
                    user
                );
                break;
            case "new_message_in_conversation":
                WebSocketInComingMessageHanlder.newMessage(
                    message,
                    dispatch,
                    user
                );
                break;
            case "action_message_creation_done":
                WebSocketInComingMessageHanlder.messageCreationDone(
                    message,
                    dispatch,
                    user
                );
                break;
            case "conversation_creation_completed":
                WebSocketInComingMessageHanlder.conversationCreationDone(
                    message,
                    dispatch,
                    user
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
        user: User
    ) {
        console.log("Create Conversation Message", message);

        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                unReadMessages: [],
                isMessageFetched: false,
                sendingMessages: []
            })
        );
    }
    static syncConversation(
        message: SyncConversationMessage,
        dispatch: AppDispatch,
        user: User
    ) {
        console.log("Sync Conversation Message", message);
        dispatch(
            ChatActions.setAllConversations(
                message.conversations.map((conv) => ({
                    conversation: conv,
                    messages: [],
                    unReadMessages: [],
                    isMessageFetched: false,
                    sendingMessages: []
                }))
            )
        );
    }
    static newMessage(
        message: NewMessageInConversationMessage,
        dispatch: AppDispatch,
        user: User
    ) {
        console.log("New Message", message);
        dispatch(ChatActions.newMessage(message.message));
    }
    static messageCreationDone(
        message: MessageCreationDoneMessage,
        dispatch: AppDispatch,
        user: User
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
            dispatch(ChatActions.removeMeesageToSending({
                conversationId: message.conversationId,
                tempId: message.tempId
            }))
            dispatch(ChatActions.newMessage(message.message));
        }
    }
    static conversationCreationDone(
        message: ConversationCreationDoneMessage,
        dispatch: AppDispatch,
        user: User
    ) {
        console.log("New Conversation", message);
        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                unReadMessages: [],
                isMessageFetched: false,
                sendingMessages: []
            })
        );
    }
}
