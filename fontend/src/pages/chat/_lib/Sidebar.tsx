"use client";

import { FC } from "react";
import { Conversation } from "../../../@types/chat";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import UserService from "../../../utils/UserService";
import useLocalStorage from "../../../Hooks/useLocalStorage";
import { GlobalVarsActions, User } from "../../../Redux/slices/GlobalVars";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    return (
        <div className="left-bar">
            <div className="actions">action</div>
            <div className="conversations">
                {conversations.map((conv) => {
                    return (
                        <div className="con" key={conv.conversation.id}>
                            <RenderConversationName
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

        console.log(requiredParticipant.userId);

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
