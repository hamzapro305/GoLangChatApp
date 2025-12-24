import { FC, useState } from "react";
import { motion } from "motion/react";
import { BiDotsVertical } from "react-icons/bi";
import { MdDoneAll } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { useAnyUser } from "@/Hooks/useUser.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { ChatMessage as ChatMessageType } from "@/@types/chat.js";

type Props = {
    Message: ChatMessageType;
};

const ChatMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const isMine = user?.id === Message.senderId;
    const [isHovering, setIsHovering] = useState(false);

    const dispatch = useAppDispatch();
    const queryUser = useAnyUser(Message.senderId);

    const selectedConversation = conversations.find(c => c.conversation.id === selectedChat?.id)?.conversation;
    const isGroup = selectedConversation?.isGroup;

    const OpenMessageOptions = () => {
        dispatch(
            ChatActions.setSelectedChat({
                messageOptions: Message.id,
            })
        );
    };

    return (
        <motion.div
            className={`msg ${isMine ? "mine" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {!isMine && isGroup && (
                <div className="profile">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${queryUser?.name || "U"}`} alt="" />
                </div>
            )}
            <motion.div
                layout
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {!isMine && isGroup && (
                    <div className="sender-name" style={{ fontSize: "0.75rem", fontWeight: "600", color: "#a78bfa", marginBottom: "2px" }}>
                        {queryUser?.name}
                    </div>
                )}
                <div
                    className="content rich-text"
                    dangerouslySetInnerHTML={{ __html: Message.content }}
                />

                <div className="meta">
                    <span className="time">10:00 AM</span>
                    {isMine && (
                        <div className="status-icon">
                            <MdDoneAll size={14} />
                        </div>
                    )}
                </div>

                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="message-actions"
                        onClick={OpenMessageOptions}
                    >
                        <BiDotsVertical />
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ChatMessage;
