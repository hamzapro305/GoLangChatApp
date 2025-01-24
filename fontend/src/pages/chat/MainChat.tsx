import "./style.scss";
import Sidebar from "./_lib/Sidebar";
import ChatHeader from "./_lib/ChatHeader";
import { useAppSelector } from "../../Redux/Hooks";
import ChatFoot from "./_lib/ChatFoot";

const MainChat = () => {
    const { conversations, selectedChat } = useAppSelector((s) => s.Chat);
    const GetSelectedConversationChat = () => {
        const Conv = conversations.find((conv) => {
            return conv.conversation.id === selectedChat;
        });
        return Conv;
    };
    return (
        <div className="chat-page">
            <ChatHeader />
            <div className="chat-page-body">
                <Sidebar />
                <div className="chat">
                    {selectedChat && (
                        <div className="chat-structure">
                            <div className="chat-head">head</div>
                            <div className="chat-body">
                                {GetSelectedConversationChat()?.messages?.map(
                                    (msg) => {
                                        return (
                                            <div
                                                className="msg"
                                                key={msg.id}
                                            >
                                                {msg.content}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <ChatFoot />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainChat;
