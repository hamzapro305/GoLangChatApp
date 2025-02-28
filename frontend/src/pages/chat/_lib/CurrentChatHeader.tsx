import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import UserService from "../../../utils/UserService";
import { SimpleConversation } from "../../../@types/chat";
import { FC } from "react";
import { User } from "../../../Redux/slices/GlobalVars";
import { LuInfo } from "react-icons/lu";
import { ChatActions } from "../../../Redux/slices/ChatSlice";
import TypingIndicator from "./TypingIndicator";
import { useAnyUser } from "@/Hooks/useUser";

const CurrentChatHeader = () => {
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const selectedConv = conversations.find((conv) => {
        return conv.conversation.id === selectedChat?.id;
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
                            <div className="desc">
                                {selectedChat && (
                                    <TypingIndicator
                                        selectedChat={selectedChat.id}
                                    />
                                )}
                            </div>
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
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const dispatch = useAppDispatch();
    const onClickChatInfo = () => {
        if (selectedChat) {
            dispatch(
                ChatActions.setSelectedChat({
                    chatInfo: !selectedChat.chatInfo,
                })
            );
        }
    };
    return (
        <div className="icon" onClick={onClickChatInfo}>
            <LuInfo />
        </div>
    );
};

const RenderConversationName: FC<{ conversation: SimpleConversation }> = ({
    conversation: conv,
}) => {
    const { selectedChat } = useAppSelector((s) => s.Chat);

    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;
    const requiredParticipant = UserService.GetChatParticipant(
        CurrentUser,
        conv
    );

    const queryUser = useAnyUser(requiredParticipant.userId);
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
                    <div className="name">{queryUser?.name ?? "Loading.."}</div>
                    <div className="desc">
                        {selectedChat && (
                            <TypingIndicator selectedChat={selectedChat.id} />
                        )}
                    </div>
                </div>
            </div>
            <OpenChatInfoIcon />
        </div>
    );
};

export default CurrentChatHeader;
