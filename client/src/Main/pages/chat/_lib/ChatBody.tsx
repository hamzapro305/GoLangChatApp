import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import ChatMessage from "./ChatMessage.js";
import { CiCircleChevDown } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import ChatNewMessage from "./ChatNewMessage.js";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";

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

    const GetSelectedConversationChatNewMessages = () => {
        const Conv = GetSelectedConversationChat();
        return Conv?.newMessages?.filter((msg) =>
            !Conv.messages.find((m) => m.id === msg.tempId)
        );
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
                behavior: "auto", // Immediate scroll on load/change
            });
        }
    }, [
        GetSelectedConversationChat()?.messages.length,
        GetSelectedConversationChat()?.newMessages.length,
        selectedChat?.id // Also scroll when changing chat
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
    }, [selectedChat, dispatch]);

    return (
        <motion.div
            className="chat-body"
            ref={chatBodyRef}
            onScroll={handleScroll}
            style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative"
            }}
        >
            {!isAtBottom && (
                <div className="down-arrow-to-bottom" onClick={scrollToBottom}>
                    <CiCircleChevDown />
                </div>
            )}
            <motion.div className="underline" style={{ scaleX }}></motion.div>

            <AnimatePresence mode="popLayout" presenceAffectsLayout initial={false}>
                {GetSelectedConversationChat()?.messages?.map((msg) => {
                    return <ChatMessage Message={msg} key={msg.id} />;
                })}
                {GetSelectedConversationChatNewMessages()?.map((msg) => {
                    return (
                        <ChatNewMessage Message={msg} key={msg.tempId} />
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
};

export default ChatBody;
