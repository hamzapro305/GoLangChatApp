import { KeyboardEvent, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { WebSocketMessageSender } from "../../../utils/WebSocketMessageSender";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import EmojiComponent from "./EmojiComponent";
import { AnimatePresence } from "motion/react";
import { ChatNewMessage } from "../../../@types/chat";
import { nanoid } from "@reduxjs/toolkit";
import { ChatActions } from "../../../Redux/slices/ChatSlice";
import useUser from "../../../Hooks/useUser";
import MessageOptions from "./MessageOptions";

const ChatFoot = () => {
    const [content, setContent] = useState("");
    const dispatch = useAppDispatch();
    const { selectedChat, emojiModal, messageOptions } = useAppSelector(
        (s) => s.Chat
    );
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const user = useUser();

    const lineCount = useMemo(() => content.split("\n").length, [content]);

    const toggleEmojiModal = () => {
        dispatch(ChatActions.setEmojiModal(!emojiModal));
    };

    const SendMessage = () => {
        if (!content) return;
        if (ws && selectedChat && user) {
            let message: ChatNewMessage = {
                conversationId: selectedChat,
                content: content,
                tempId: nanoid(10),
                status: "loading",
                senderId: user.id,
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
            <AnimatePresence presenceAffectsLayout propagate mode="sync">
                {emojiModal && <EmojiComponent />}
                {messageOptions && <MessageOptions />}
            </AnimatePresence>
        </div>
    );
};

export default ChatFoot;
