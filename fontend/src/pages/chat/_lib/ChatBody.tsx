import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import ChatMessage from "./ChatMessage";
import { CiCircleChevDown } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import ChatNewMessage from "./ChatNewMessage";
import { ChatActions } from "../../../Redux/slices/ChatSlice";

const ChatBody = () => {
    const { conversations, selectedChat } = useAppSelector((s) => s.Chat);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const dispatch = useAppDispatch();

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
            setIsAtBottom(
                Math.abs(scrollTop + clientHeight - scrollHeight) < 1
            );
        }
    };

    const GetSelectedConversationChat = () => {
        const Conv = conversations.find((conv) => {
            return conv.conversation.id === selectedChat?.id;
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
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
            });
        }
    }, [
        GetSelectedConversationChat()?.messages.length,
        GetSelectedConversationChat()?.newMessages.length,
    ]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (selectedChat) {
                    dispatch(ChatActions.setSelectedChat(null));
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (
        <motion.div className="chat-body">
            {!isAtBottom && (
                <div className="down-arrow-to-bottom" onClick={scrollToBottom}>
                    <CiCircleChevDown />
                </div>
            )}
            <motion.div className="underline" style={{ scaleX }}></motion.div>
            <div className="messages" ref={chatBodyRef}>
                <AnimatePresence mode="sync" presenceAffectsLayout>
                    {GetSelectedConversationChat()?.messages?.map((msg) => {
                        return <ChatMessage Message={msg} key={msg.id} />;
                    })}
                    {GetSelectedConversationChat()?.newMessages.map((msg) => {
                        return (
                            <ChatNewMessage Message={msg} key={msg.tempId} />
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ChatBody;
