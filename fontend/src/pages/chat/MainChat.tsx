import "./style.scss";
import Sidebar from "./_lib/Sidebar";
import ChatHeader from "./_lib/ChatHeader";

const MainChat = () => {
    return (
        <div className="chat-page">
            <ChatHeader />
            <div className="chat-page-body">
                <Sidebar />
                <div className="chat"></div>
            </div>
        </div>
    );
};

export default MainChat;
