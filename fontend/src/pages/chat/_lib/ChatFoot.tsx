import { KeyboardEvent, useMemo, useState } from "react";
import { useAppSelector } from "../../../Redux/Hooks";
import { WebSocketMessageSender } from "../../../utils/WebSocketMessageSender";

const ChatFoot = () => {
    const [content, setContent] = useState("");
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const ws = useAppSelector((s) => s.GlobalVars.ws);

    const lineCount = useMemo(() => content.split("\n").length, [content]);

    const SendMessage = () => {
        if (ws && selectedChat) {
            WebSocketMessageSender.createNewMessage(ws, selectedChat, content);
            setContent("");
        }
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line
            SendMessage();
        }
    };

    console.log(`calc(100% - 40px -${lineCount * 20}px)`);

    return (
        <div className="chat-foot">
            <div
                className="box"
                style={{ height: `calc(100% - 40px -${lineCount * 20}px)` }}
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type Message"
                    onKeyDownCapture={handleKeyDown}
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
