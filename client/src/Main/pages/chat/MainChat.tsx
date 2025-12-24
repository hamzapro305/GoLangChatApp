import "./style.scss";
import Sidebar from "./_lib/Sidebar.js";
import { motion, AnimatePresence } from "motion/react";
import ChatHeader from "./_lib/ChatHeader.js";
import ChatFoot from "./_lib/ChatFoot.js";
import CurrentChatHeader from "./_lib/CurrentChatHeader.js";
import ChatBody from "./_lib/ChatBody.js";
import { useAppSelector } from "@/Redux/Hooks.js";
import ChatInfo from "./_lib/ChatInfo.js";

const MainChat = () => {
    const { selectedChat } = useAppSelector((s) => s.Chat);
    return (
        <div className="chat-page">
            <ChatHeader />
            <motion.div className="chat-page-body">
                <Sidebar />
                <div className="chat">
                    {selectedChat ? (
                        <>
                            <div className="chat-structure">
                                <CurrentChatHeader />
                                <ChatBody />
                                <ChatFoot />
                            </div>

                            <motion.div
                                initial={false}
                                animate={{
                                    width: selectedChat?.chatInfo ? 350 : 0,
                                    opacity: selectedChat?.chatInfo ? 1 : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{
                                    overflow: "hidden",
                                    height: "100%",
                                    flexShrink: 0
                                }}
                            >
                                <ChatInfo />
                            </motion.div>
                        </>
                    ) : (
                        <div className="chat-unselected">Open Chat</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default MainChat;
