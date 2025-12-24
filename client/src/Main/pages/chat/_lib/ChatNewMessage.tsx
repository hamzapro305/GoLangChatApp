import { FC, useState } from "react";
import { ChatNewMessage as ChatNewMessageT } from "@/@types/chat.js";
import { motion } from "motion/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { MdDoneAll } from "react-icons/md";
import { useAppSelector } from "@/Redux/Hooks.js";
import { useAnyUser } from "@/Hooks/useUser.js";

type Props = {
    Message: ChatNewMessageT;
};

const ChatNewMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const isMine = user?.id === Message.senderId;
    const [isHovering, setIsHovering] = useState(false);

    const User = useAnyUser(Message.senderId);
    const selectedConversation = conversations.find(c => c.conversation.id === selectedChat?.id)?.conversation;
    const isGroup = selectedConversation?.isGroup;

    const getStatusIcon = () => {
        switch (Message.status) {
            case "failed":
                return <RxCrossCircled color="#ef4444" size={14} />;
            case "loading":
                return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}>
                    <AiOutlineLoading3Quarters size={12} />
                </motion.div>;
            case "sent":
                return <MdDoneAll size={14} />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className={`msg ${isMine ? "mine" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {!isMine && isGroup && (
                <div className="profile">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${User?.name || "U"}`} alt="" />
                </div>
            )}
            <motion.div
                layout
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
                style={{ opacity: Message.status === "loading" ? 0.7 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {!isMine && isGroup && (
                    <div className="sender-name" style={{ fontSize: "0.75rem", fontWeight: "600", color: "#a78bfa", marginBottom: "2px" }}>
                        {User?.name}
                    </div>
                )}
                <div
                    className="content rich-text"
                    dangerouslySetInnerHTML={{ __html: Message.content }}
                />

                <div className="meta">
                    <span className="time">Just now</span>
                    <div className="status-icon">
                        {getStatusIcon()}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ChatNewMessage;
