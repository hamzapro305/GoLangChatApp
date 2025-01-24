import "./style.scss";
import Sidebar from "./_lib/Sidebar";
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
            <div className="chat-page-body">
                <Sidebar />
                <div className="chat">
                    {selectedChat && (
                        <div className="chat-structure">
                            <CurrentChatHeader />
                            <ChatBody />
                            <ChatFoot />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainChat;
