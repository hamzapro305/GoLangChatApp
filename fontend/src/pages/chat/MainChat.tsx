import "./style.scss";
import Sidebar from "./_lib/Sidebar";
import ChatHeader from "./_lib/ChatHeader";
import { useAppSelector } from "../../Redux/Hooks";
import ChatFoot from "./_lib/ChatFoot";
import CurrentChatHeader from "./_lib/CurrentChatHeader";
import ChatMessage from "./_lib/ChatMessage";

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
                            <CurrentChatHeader />
                            <div className="chat-body">
                                <div className="messages">
                                    {GetSelectedConversationChat()?.messages?.map(
                                        (msg) => {
                                            return (
                                                <ChatMessage
                                                    Message={msg}
                                                    key={msg.id}
                                                />
                                            );
                                        }
                                    )}
                                </div>
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
