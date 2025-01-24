import { FC } from "react";
import { ChatMessage as ChatMessageType } from "../../../@types/chat";
import { useAppSelector } from "../../../Redux/Hooks";
import { motion } from "motion/react";

type Props = {
    Message: ChatMessageType;
};
const ChatMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const isMine = user?.id === Message.senderId;
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileInView={{
                x: isMine ? -20 : 20,
                opacity: 1,
                transition: {
                    duration: 0.6,
                    damping: 10,
                    bounce: 10,
                },
            }}
            initial={{ opacity: 0, x: isMine ? 20 : -20 }}
            // viewport={{ once: true }}
            className={`msg ${isMine ? "mine" : ""}`}
        >
            <div className="content">{Message.content}</div>
            <div className="name">User Name</div>
            <div className="options"></div>
        </motion.div>
    );
};

export default ChatMessage;
