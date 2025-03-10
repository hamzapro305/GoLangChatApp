import { AppDispatch } from "../Redux/store";
import { ChatActions, ChatSliceT } from "../Redux/slices/ChatSlice";
import {
    ConversationCreationCompleteMessage,
    NewMessageInConversationMessage,
    SetUserStopTypingMessage,
    SetUserTypingMessage,
    SyncConversationMessage,
    WebSocketMessage,
} from "../@types/socket";
import { User } from "../Redux/slices/GlobalVars";
import { Toast } from "../components/HSToast";

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
            case "user_started_typing":
                WebSocketInComingMessageHanlder.userStartedTyping(
                    message,
                    dispatch,
                    data
                )
                break;
            case "user_stopped_typing":
                WebSocketInComingMessageHanlder.userStoppedTyping(
                    message,
                    dispatch,
                    data
                )
                break;
            default:
                console.log("Unknown Message", message);
                break;
        }
    }
    static newConversation(
        message: ConversationCreationCompleteMessage,
        dispatch: AppDispatch,
        _data: Data,
    ) {
        console.log("Create Conversation Message", message);

        dispatch(
            ChatActions.addNewConversation({
                conversation: message.conversation,
                messages: [],
                unReadMessages: [],
                isMessageFetched: false,
                newMessages: [],
                usersTyping: []
            })
        );
    }
    static syncConversation(
        message: SyncConversationMessage,
        dispatch: AppDispatch,
        _data: Data,
    ) {
        console.log("Sync Conversation Message", message);
        dispatch(
            ChatActions.setAllConversations(
                message.conversations.map((conv) => ({
                    conversation: conv ?? [],
                    messages: [],
                    unReadMessages: [],
                    isMessageFetched: false,
                    newMessages: [],
                    usersTyping: []
                }))
            )
        );
    }
    static newMessage(
        message: NewMessageInConversationMessage,
        dispatch: AppDispatch,
        _data: Data,
    ) {
        console.log("New Message", message);
        dispatch(
            ChatActions.newMessageInChat({
                message: message.message,
                tempId: message.message.id,
            })
        );
        Toast.SuccessToast("New Message In Chat!", {
            toastId: message.message.conversationId
        })
    }

    static userStartedTyping(
        message: SetUserTypingMessage,
        dispatch: AppDispatch,
        _data: Data,
    ) {
        dispatch(
            ChatActions.setUserTyping({
                conversationId: message.conversation_id,
                userId: message.user_id
            })
        )
    }
    static userStoppedTyping(
        message: SetUserStopTypingMessage,
        dispatch: AppDispatch,
        _data: Data,
    ) {
        dispatch(
            ChatActions.setUserStoppedTyping({
                conversationId: message.conversation_id,
                userId: message.user_id
            })
        )
    }
}
