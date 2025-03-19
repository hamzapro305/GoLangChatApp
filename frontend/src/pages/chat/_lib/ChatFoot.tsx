import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { AnimatePresence } from "motion/react";
import { nanoid } from "@reduxjs/toolkit";
import MessageOptions from "./MessageOptions";
import EmojiComponent from "./EmojiComponent";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import useUser from "@/Hooks/useUser";
import { ChatActions } from "@/Redux/slices/ChatSlice";
import { ChatNewMessage } from "@/@types/chat";
import { WebSocketMessageSender } from "@/utils/WebSocketMessageSender";

const ChatFoot = () => {
    const [content, setContent] = useState("");
    const dispatch = useAppDispatch();
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const user = useUser();

    const handleTyping = (content: string) => {
        if (!ws || !selectedChat) return;
        setContent(content);
        setIsTyping(true);

        // Pehle se existing timeout clear kar do
        if (typingTimeout) clearTimeout(typingTimeout);

        // Naya timeout set karo, jo 2 sec baad "Not Typing" karega
        const timeout = setTimeout(() => {
            console.log("Sending that is not typing");
            setIsTyping(false);
        }, 2000);

        setTypingTimeout(timeout);
    };

    const TypingIndicator = (isTyping: boolean) => {
        if (!ws || !selectedChat) return;
        if (isTyping) {
            WebSocketMessageSender.userTypingStatus(
                ws,
                selectedChat.id,
                "user_started_typing"
            );
        } else {
            WebSocketMessageSender.userTypingStatus(
                ws,
                selectedChat.id,
                "user_stopped_typing"
            );
        }
    };

    useEffect(() => {
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [typingTimeout]);

    useEffect(() => {
        TypingIndicator(isTyping);
    }, [isTyping]);

    const lineCount = useMemo(() => content.split("\n").length, [content]);

    const toggleEmojiModal = () => {
        if (selectedChat) {
            dispatch(
                ChatActions.setSelectedChat({
                    emojiModal: !selectedChat.emojiModal,
                })
            );
        }
    };

    const pushToContent = (myString: string) => {
        setContent((p) => (p += myString));
    };

    const SendMessage = () => {
        if (!content) return;
        if (ws && selectedChat && user) {
            let message: ChatNewMessage = {
                conversationId: selectedChat.id,
                content: content,
                tempId: nanoid(10),
                status: "loading",
                senderId: user.id,
            };
            dispatch(
                ChatActions.addNewMeesageToSending({
                    conversationId: selectedChat.id,
                    message: message,
                })
            );
            WebSocketMessageSender.createNewMessage(ws, {
                content,
                conversationId: selectedChat.id,
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
                    onChange={(e) => handleTyping(e.target.value)}
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
                    <button className="btn-global" onClick={SendMessage}>
                        Submit
                    </button>
                </div>
            </div>
            <AnimatePresence presenceAffectsLayout propagate mode="sync">
                {selectedChat?.emojiModal && (
                    <EmojiComponent
                        pushToContent={pushToContent}
                        onClose={toggleEmojiModal}
                    />
                )}
                {selectedChat?.messageOptions && <MessageOptions />}
            </AnimatePresence>
        </div>
    );
};

export default ChatFoot;
