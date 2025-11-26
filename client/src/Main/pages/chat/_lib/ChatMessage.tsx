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
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            animate={{
                background: isHovering ? "#6a309344" : "#6a309300",
                transition: {
                    duration: 0.1,
                },
            }}
        >
            <motion.div
                whileInView={{
                    x: isMine ? -msgXPositttion : msgXPositttion,
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration: 0.4,
                        damping: 100,
                        bounce: 10,
                    },
                }}
                initial={{ opacity: 0, x: isMine ? 20 : -20, scale: 0 }}
                viewport={{ once: true }}
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
            >
                <div className="content">{Message.content}</div>
                <div className="profile">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="name">{queryUser?.name}</div>
                <div className="status">
                    <div className="icon">
                        <MdDoneAll color="blue"  />
                    </div>
                </div>
                {isHovering && (
                    <div className="option-icon" onClick={OpenMessageOptions}>
                        <BiDotsVertical />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ChatMessage;
