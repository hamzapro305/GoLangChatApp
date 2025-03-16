import { FC } from "react";
import { motion } from "motion/react";
import useToken from "@/Hooks/useToken";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars";
import { ChatActions, SingleChatT } from "@/Redux/slices/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import MessageService from "@/utils/MessageService";
import { User } from "@/Redux/slices/GlobalVars";
import { SimpleConversation } from "@/@types/chat";
import UserService from "@/utils/UserService";
import { useAnyUser } from "@/Hooks/useUser";

const Sidebar = () => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    const selectedChat = useAppSelector((s) => s.Chat.selectedChat);
    const [token, _] = useToken();
    const dispatch = useAppDispatch();
    const CreateConv = () => {
        dispatch(ModalVarsVarsActions.setCreateConversation(true));
    };
    const SelectChat = (chat: SingleChatT) => {
        if (token) {
            dispatch(
                ChatActions.setSelectedChat({
                    id: chat.conversation.id,
                    emojiModal: false,
                    messageOptions: null,
                    chatInfo: false,
                })
            );
            dispatch(ChatActions.readMessages(chat.conversation.id));
            if (!chat.isMessageFetched) {
                MessageService.FetchMessages(token, chat.conversation.id).then(
                    (res) => {
                        dispatch(
                            ChatActions.setMessages({
                                convId: chat.conversation.id,
                                messages: res,
                            })
                        );
                        dispatch(
                            ChatActions.setIsMessagesFetched(
                                chat.conversation.id
                            )
                        );
                    }
                );
            }
        }
    };
    return (
        <div className="left-bar">
            <div className="query">
                <input type="text" placeholder="Search" />
                <div className="actions">
                    <button onClick={CreateConv}>New chat</button>
                </div>
            </div>
            <div className="conversations">
                {conversations?.map((conv) => {
                    const isSelectedChat =
                        selectedChat?.id == conv.conversation.id;
                    return (
                        <div
                            className={`conv ${isSelectedChat ? "active" : ""}`}
                            key={conv.conversation.id}
                            onClick={() => SelectChat(conv)}
                        >
                            <RenderConversationName
                                key={conv.conversation.id}
                                chat={conv}
                            />
                            {isSelectedChat && (
                                <motion.div
                                    layoutId="active-conversation-indicator"
                                    className="active-indicator"
                                />
                            )}
                            {conv.unReadMessages.length > 0 && (
                                <div className="unread">
                                    {conv.unReadMessages.length}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RenderConversationName: FC<{ chat: SingleChatT }> = ({ chat }) => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;

    const getUnread = () => {
        return chat.unReadMessages.length > 0 ? (
            <div className="message">
                {chat.unReadMessages[chat.unReadMessages.length - 1].content}
            </div>
        ) : (
            "----"
        );
    };

    if (chat.conversation.isGroup) {
        return (
            <div className="conv-wrapper">
                <div className="profile">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="name">{chat.conversation.groupName}</div>
                    {getUnread()}
                </div>
            </div>
        );
    }

    const GetUserConversationName = () => {
        const requiredParticipant = UserService.GetChatParticipant(
            CurrentUser,
            chat.conversation as SimpleConversation
        );

        const User = useAnyUser(requiredParticipant.userId)

        return (
            <div className="conv-wrapper">
                <div className="profile">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="name">
                        {User?.name ?? "Loading.."}
                    </div>
                    {getUnread()}
                </div>
            </div>
        );
    };

    return <GetUserConversationName />;
};

export default Sidebar;
