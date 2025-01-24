import { useAppSelector } from "../../../Redux/Hooks";
import { motion, useScroll, useSpring } from "motion/react";
import ChatMessage from "./ChatMessage";
import { CiCircleChevDown } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";

const ChatBody = () => {
    const { conversations, selectedChat } = useAppSelector((s) => s.Chat);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const chatBodyRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: chatBodyRef,
    });
    const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 100 });

    const handleScroll = () => {
        if (chatBodyRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                chatBodyRef.current;
            setIsAtBottom(scrollTop + clientHeight === scrollHeight);
        }
    };

    const GetSelectedConversationChat = () => {
        const Conv = conversations.find((conv) => {
            return conv.conversation.id === selectedChat;
        });
        return Conv;
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.addEventListener("scroll", handleScroll);
            return () => {
                if (chatBodyRef.current) {
                    chatBodyRef.current.removeEventListener(
                        "scroll",
                        handleScroll
                    );
                }
            };
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [GetSelectedConversationChat()?.messages.length]);

    return (
        <motion.div className="chat-body">
            {!isAtBottom && (
                <div className="down-arrow-to-bottom" onClick={scrollToBottom}>
                    <CiCircleChevDown />
                </div>
            )}
            <motion.div className="underline" style={{ scaleX }}></motion.div>
            <div className="messages" ref={chatBodyRef}>
                {GetSelectedConversationChat()?.messages?.map((msg) => {
                    return <ChatMessage Message={msg} key={msg.id} />;
                })}
            </div>
        </motion.div>
    );
};

export default ChatBody;
