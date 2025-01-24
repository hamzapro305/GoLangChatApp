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

const Sidebar = () => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    const selectedChat = useAppSelector((s) => s.Chat.selectedChat);
    const [token, _] = useToken();
    const dispatch = useAppDispatch();
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
                    <button>Test 1</button>
                    <button>Test 2</button>
                </div>
            </div>
            <div className="conversations">
                {conversations.map((conv) => {
                    return (
                        <div
                            className={`conv ${
                                selectedChat == conv.conversation.id
                                    ? "active"
                                    : ""
                            }`}
                            key={conv.conversation.id}
                            onClick={() => SelectChat(conv)}
                        >
                            <RenderConversationName
                                key={conv.conversation.id}
                                conversation={conv.conversation}
                            />
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
