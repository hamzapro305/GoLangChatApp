import { AppDispatch } from "../Redux/store";
import { ChatActions } from "../Redux/slices/ChatSlice";
import {
    ConversationCreationCompleteMessage,
    ConversationCreationDoneMessage,
    MessageCreationDoneMessage,
    NewMessageInConversationMessage,
    SyncConversationMessage,
    WebSocketMessage,
} from "../@types/chat";

export class WebSocketInComingMessageHanlder {
    static BasicMessageHandler(
        message: WebSocketMessage,
        dispatch: AppDispatch
    ) {
        switch (message.type) {
            case "sync_conversations":
                WebSocketInComingMessageHanlder.syncConversation(
                    message,
                    dispatch
                );
                break;
            case "new_conversation":
                WebSocketInComingMessageHanlder.newConversation(
                    message,
                    dispatch
                );
                break;
            case "new_message_in_conversation":
                WebSocketInComingMessageHanlder.newMessage(message, dispatch);
                break;
            case "action_message_creation_done":
                WebSocketInComingMessageHanlder.messageCreationDone(
                    message,
                    dispatch
                );
                break;
            case "conversation_creation_completed":
                WebSocketInComingMessageHanlder.conversationCreationDone(
                    message,
                    dispatch
                );
                break;
            default:
                console.log("Unknown Message", message);
                break;
        }
    }
    static newConversation(
        message: ConversationCreationCompleteMessage,
        dispatch: AppDispatch
    ) {
        console.log("Create Conversation Message", message);

        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                isMessageFetched: false,
            })
        );
    }
    static syncConversation(
        message: SyncConversationMessage,
        dispatch: AppDispatch
    ) {
        console.log("Sync Conversation Message", message);
        dispatch(
            ChatActions.setAllConversations(
                message.conversations.map((conv) => ({
                    conversation: conv,
                    messages: [],
                    isMessageFetched: false,
                }))
            )
        );
    }
    static newMessage(
        message: NewMessageInConversationMessage,
        dispatch: AppDispatch
    ) {
        console.log("New Message", message);
        dispatch(ChatActions.newMessage(message.message));
    }

    static messageCreationDone(
        message: MessageCreationDoneMessage,
        dispatch: AppDispatch
    ) {
        console.log("New Message", message);
        dispatch(ChatActions.newMessage(message.message));
    }
    static conversationCreationDone(
        message: ConversationCreationDoneMessage,
        dispatch: AppDispatch
    ) {
        console.log("New Conversation", message);
        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                isMessageFetched: false,
            })
        );
    }
}
