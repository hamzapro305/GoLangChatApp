import { useAppSelector } from "../../../Redux/Hooks";
import { motion, useScroll } from "motion/react";
import ChatMessage from "./ChatMessage";
import { CiCircleChevDown } from "react-icons/ci";
import { useRef } from "react";

const ChatBody = () => {
    const { conversations, selectedChat } = useAppSelector((s) => s.Chat);

    const chatBodyRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        container: chatBodyRef,
    });

    const GetSelectedConversationChat = () => {
        const Conv = conversations.find((conv) => {
            return conv.conversation.id === selectedChat;
        });
        return Conv;
    };

    return (
        <motion.div className="chat-body">
            <div className="down-arrow-to-bottom">
                <CiCircleChevDown />
            </div>
            <motion.div
                className="underline"
                style={{ scaleX: scrollYProgress }}
            ></motion.div>
            <div className="messages" ref={chatBodyRef}>
                {GetSelectedConversationChat()?.messages?.map((msg) => {
                    return <ChatMessage Message={msg} key={msg.id} />;
                })}
            </div>
        </motion.div>
    );
};

export default ChatBody;
