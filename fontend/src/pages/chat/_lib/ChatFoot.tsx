import React, { useState } from "react";
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
    return (
        <div className="chat-foot">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="options">
                <div className="actions"></div>
                <button onClick={SendMessage}>Submit</button>
            </div>
        </div>
    );
};

export default ChatFoot;
