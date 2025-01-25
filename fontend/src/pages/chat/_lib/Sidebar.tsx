"use client";

import { FC } from "react";
import { Conversation } from "../../../@types/chat";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import UserService from "../../../utils/UserService";
import useLocalStorage from "../../../Hooks/useLocalStorage";
import { User } from "../../../Redux/slices/GlobalVars";
import { useQuery } from "@tanstack/react-query";
import { ChatActions, SingleChatT } from "../../../Redux/slices/ChatSlice";
import MessageService from "../../../utils/MessageService";
import useToken from "../../../Hooks/useToken";
import { motion } from "motion/react";
import { ModalVarsVarsActions } from "../../../Redux/slices/ModalVars";

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
            dispatch(ChatActions.setSelectedChat(chat.conversation.id));
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
                {conversations.map((conv) => {
                    const isSelectedChat = selectedChat == conv.conversation.id;
                    return (
                        <div
                            className={`conv ${isSelectedChat ? "active" : ""}`}
                            key={conv.conversation.id}
                            onClick={() => SelectChat(conv)}
                        >
                            <RenderConversationName
                                key={conv.conversation.id}
                                conversation={conv.conversation}
                            />
                            {isSelectedChat && (
                                <motion.div
                                    layoutId="active-conversation-indicator"
                                    className="active-indicator"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RenderConversationName: FC<{ conversation: Conversation }> = ({
    conversation: conv,
}) => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;

    if (conv.isGroup) {
        return <div className="name">{conv.groupName}</div>;
    }

    const GetUserConversationName = () => {
        const [token, _] = useLocalStorage<string | null>("token", null);
        const requiredParticipant = UserService.GetChatParticipant(
            CurrentUser,
            conv
        );

        const query = useQuery({
            queryKey: [requiredParticipant.userId],
            staleTime: Infinity,
            queryFn: () => {
                return UserService.fetchUserById(
                    requiredParticipant.userId,
                    token as string
                );
            },
        });

        return <div className="name">{query.data?.email ?? "Loading.."}</div>;
    };

    return <GetUserConversationName />;
};

export default Sidebar;
