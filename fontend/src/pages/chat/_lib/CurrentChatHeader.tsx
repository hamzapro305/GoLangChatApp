import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "../../../Hooks/useLocalStorage";
import { useAppSelector } from "../../../Redux/Hooks";
import UserService from "../../../utils/UserService";
import { SimpleConversation } from "../../../@types/chat";
import { FC } from "react";
import { User } from "../../../Redux/slices/GlobalVars";
import { LuInfo } from "react-icons/lu";

const CurrentChatHeader = () => {
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const selectedConv = conversations.find((conv) => {
        return conv.conversation.id === selectedChat;
    });

    if (selectedConv) {
        if (selectedConv.conversation.isGroup) {
            return (
                <div className="current-chat-head">
                    <div className="user">
                        <div className="profile">
                            <img
                                src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                                alt=""
                            />
                        </div>
                        <div className="content">
                            <div className="name">
                                {selectedConv.conversation.groupName}
                            </div>
                            <div className="desc">Something</div>
                        </div>
                    </div>
                    <OpenChatInfoIcon />
                </div>
            );
        } else {
            return (
                <RenderConversationName
                    conversation={selectedConv.conversation}
                />
            );
        }
    }
};

const OpenChatInfoIcon = () => {
    return (
        <div className="icon">
            <LuInfo />
        </div>
    );
};

const RenderConversationName: FC<{ conversation: SimpleConversation }> = ({
    conversation: conv,
}) => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;

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

    return (
        <div className="current-chat-head">
            <div className="user">
                <div className="profile">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="name">
                        {query.data?.email ?? "Loading.."}
                    </div>
                    <div className="desc">Something</div>
                </div>
            </div>
            <OpenChatInfoIcon />
        </div>
    );
};

export default CurrentChatHeader;
