"use client";

import { FC } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import useToken from "@/Hooks/useToken.js";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars.js";
import { ChatActions, SingleChatT } from "@/Redux/slices/ChatSlice.js";
import MessageService from "@/utils/MessageService.js";
import UserService from "@/utils/UserService.js";
import { SimpleConversation } from "@/@types/chat.js";
import { useAnyUser } from "@/Hooks/useUser.js";
import { User } from "@/Redux/slices/GlobalVars.js";

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
                {conversations?.map((conv, index) => {
                    const isSelectedChat =
                        selectedChat?.id == conv.conversation.id;
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 4 }}
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
                                    layoutId="active-pill"
                                    className="active-indicator"
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "20%",
                                        height: "60%",
                                        width: "4px",
                                        borderRadius: "0 4px 4px 0",
                                        background: "linear-gradient(to bottom, #7c3aed, #db2777)"
                                    }}
                                />
                            )}
                            {conv.unReadMessages.length > 0 && (
                                <div className="unread">
                                    {conv.unReadMessages.length}
                                </div>
                            )}
                        </motion.div>
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
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.conversation.groupName}`}
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
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${User?.name || "U"}`}
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
