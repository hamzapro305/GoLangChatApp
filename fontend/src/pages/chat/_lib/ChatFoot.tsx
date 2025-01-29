import { KeyboardEvent, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { WebSocketMessageSender } from "../../../utils/WebSocketMessageSender";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import EmojiComponent from "./EmojiComponent";
import { ModalVarsVarsActions } from "../../../Redux/slices/ModalVars";
import { AnimatePresence } from "motion/react";
import { ChatLoadingMessage, ChatMessage } from "../../../@types/chat";
import { nanoid } from "@reduxjs/toolkit";
import { ChatActions } from "../../../Redux/slices/ChatSlice";

const ChatFoot = () => {
    const [content, setContent] = useState("");
    const dispatch = useAppDispatch();
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const emojiModal = useAppSelector((s) => s.ModalVars.emojiModal);

    const lineCount = useMemo(() => content.split("\n").length, [content]);

    const toggleEmojiModal = () => {
        dispatch(ModalVarsVarsActions.setEmojiModal(!emojiModal));
    };

    const SendMessage = () => {
        if (ws && selectedChat) {
            let message: ChatLoadingMessage = {
                conversationId: selectedChat,
                content: content,
                tempId: nanoid(10),
                status: "loading",
            };
            dispatch(
                ChatActions.addNewMeesageToSending({
                    conversationId: selectedChat,
                    message: message,
                })
            );
            WebSocketMessageSender.createNewMessage(ws, {
                content,
                conversationId: selectedChat,
                tempId: message.tempId,
            });
            setContent("");
        }
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents new line
            SendMessage();
        }
    };

    return (
        <div className="chat-foot">
            <div className="box">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={lineCount > 10 ? 10 : lineCount}
                    placeholder="Type Message"
                    onKeyDownCapture={handleKeyDown}
                />
                <div className="options">
                    <div className="actions">
                        <div className="emoji" onClick={toggleEmojiModal}>
                            <MdOutlineEmojiEmotions />
                        </div>
                        <div className="attachment">
                            <GrAttachment />
                        </div>
                    </div>
                    <button onClick={SendMessage}>Submit</button>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {emojiModal && <EmojiComponent />}
            </AnimatePresence>
        </div>
    );
};

export default ChatFoot;
