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
    const isMine = user?.id === Message.senderId;
    const [isHovering, setIsHovering] = useState(false);

    const dispatch = useAppDispatch();
    const queryUser = useAnyUser(Message.senderId);

    const OpenMessageOptions = () => {
        dispatch(
            ChatActions.setSelectedChat({
                messageOptions: Message.id,
            })
        );
    };

    const msgXPositttion = isHovering ? 70 : 60;

    return (
        <motion.div
            className={`msg ${isMine ? "mine" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <motion.div
                layout
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div
                    className="content rich-text"
                    dangerouslySetInnerHTML={{ __html: Message.content }}
                />
                <div className="status">
                    <div className="icon">
                        <MdDoneAll color={isMine ? "#fff" : "#10b981"} />
                    </div>
                </div>
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="option-icon"
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
