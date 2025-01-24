import { KeyboardEvent, useState } from "react";
import { useAppSelector } from "../../../Redux/Hooks";
import { WebSocketMessageSender } from "../../../utils/WebSocketMessageSender";

const ChatFoot = () => {
    const [content, setContent] = useState("");
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const SendMessage = () => {
        if (ws && selectedChat) {
            WebSocketMessageSender.createNewMessage(ws, selectedChat, content);
            setContent("");
        }
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            SendMessage();
        }
    };

    return (
        <div className="chat-foot">
            <div className="box">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type Message"
                    onKeyDown={handleKeyDown}
                />
                <div className="options">
                    <div className="actions"></div>
                    <button onClick={SendMessage}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ChatFoot;
