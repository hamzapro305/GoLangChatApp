import "./style.scss";
import Sidebar from "./_lib/Sidebar";
import { motion } from "motion/react";
import ChatHeader from "./_lib/ChatHeader";
import { useAppSelector } from "../../Redux/Hooks";
import ChatFoot from "./_lib/ChatFoot";
import CurrentChatHeader from "./_lib/CurrentChatHeader";
import ChatBody from "./_lib/ChatBody";

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
                                className="chat-user-profile"
                                animate={{
                                    width: selectedChat?.chatInfo
                                        ? "300px"
                                        : "0",
                                }}
                            ></motion.div>
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
