import { FC, useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import MessageOptions from "./MessageOptions/index.js";
import { BiDotsVertical } from "react-icons/bi";
import { MdDoneAll } from "react-icons/md";
import { FaFileAlt, FaVideo, FaImage } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { useAnyUser } from "@/Hooks/useUser.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { ChatMessage as ChatMessageType } from "@/@types/chat.js";

type Props = {
    Message: ChatMessageType;
};

const ChatMessage = forwardRef<HTMLDivElement, Props>(({ Message }, ref) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const isMine = user?.id === Message.senderId;
    const [isHovering, setIsHovering] = useState(false);

    const dispatch = useAppDispatch();
    const queryUser = useAnyUser(Message.senderId);

    const selectedConversation = conversations.find(c => c.conversation.id === selectedChat?.id)?.conversation;
    const isGroup = selectedConversation?.isGroup;

    const repliedMessage = Message.replyTo ? conversations
        .find(c => c.conversation.id === selectedChat?.id)
        ?.messages.find(m => m.id === Message.replyTo) : null;
    const repliedUser = useAnyUser(repliedMessage?.senderId || "");

    const OpenMessageOptions = () => {
        dispatch(
            ChatActions.setSelectedChat({
                messageOptions: Message.id,
            })
        );
    };

    const scrollToMessage = (msgId: string) => {
        const element = document.getElementById(`msg-${msgId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("highlight-flash");
            setTimeout(() => {
                element.classList.remove("highlight-flash");
            }, 2000);
        }
    };

    return (
        <motion.div
            ref={ref}
            id={`msg-${Message.id}`}
            className={`msg ${isMine ? "mine" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {!isMine && isGroup && (
                <div className="profile">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${queryUser?.name || "U"}`} alt="" />
                </div>
            )}
            <motion.div
                layout
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {repliedMessage && (
                    <div className="replied-preview" onClick={() => scrollToMessage(repliedMessage.id)}>
                        <span className="user-name">{repliedUser?.name || "Someone"}</span>
                        <div className="preview-content-row">
                            {(repliedMessage.type === "image" || (repliedMessage.attachmentUrl && repliedMessage.type === "image")) && (
                                <div className="reply-media-thumb">
                                    <img src={repliedMessage.attachmentUrl || repliedMessage.content} alt="Reply Thumb" />
                                </div>
                            )}
                            {repliedMessage.type === "video" && <div className="reply-icon-wrapper"><FaVideo /></div>}
                            {repliedMessage.type === "file" && <div className="reply-icon-wrapper"><FaFileAlt /></div>}

                            <div className="preview-text" dangerouslySetInnerHTML={{
                                __html: (repliedMessage.attachmentUrl ? repliedMessage.content : (
                                    repliedMessage.type === "image" ? "Photo" :
                                        repliedMessage.type === "video" ? "Video" :
                                            repliedMessage.type === "file" ? "Document" :
                                                repliedMessage.content
                                )) || "Media"
                            }} />
                        </div>
                    </div>
                )}
                {!isMine && isGroup && (
                    <div className="sender-name" style={{ fontSize: "0.75rem", fontWeight: "600", color: "#a78bfa", marginBottom: "2px" }}>
                        {queryUser?.name}
                    </div>
                )}
                {/* Attachment Rendering */}
                {(Message.attachmentUrl || (Message.type !== "text" && Message.content)) && (
                    <>
                        {Message.type === "image" ? (
                            <div className="media-content image">
                                <img
                                    src={Message.attachmentUrl || Message.content}
                                    alt="attachment"
                                />
                            </div>
                        ) : Message.type === "video" ? (
                            <div className="media-content video">
                                <video
                                    src={Message.attachmentUrl || Message.content}
                                    controls
                                />
                            </div>
                        ) : (
                            <div className="media-content file">
                                <a href={Message.attachmentUrl || Message.content} target="_blank" rel="noreferrer" className="file-attachment">
                                    <FaFileAlt size={24} />
                                    <div className="file-info">
                                        <span className="file-name">Attachment</span>
                                        <span className="file-size">Click to download</span>
                                    </div>
                                </a>
                            </div>
                        )}
                    </>
                )}

                {/* Text Content / Caption */}
                {(Message.type === "text" || (Message.attachmentUrl && Message.content)) && (
                    <div
                        className="content rich-text"
                        dangerouslySetInnerHTML={{ __html: Message.content }}
                        style={(Message.attachmentUrl || (Message.type !== "text" && Message.content)) ? { marginTop: "8px" } : {}}
                    />
                )}

                <div className="meta">
                    <span className="time">10:00 AM</span>
                    {isMine && (
                        <div className="status-icon">
                            <MdDoneAll size={14} />
                        </div>
                    )}
                </div>

                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="message-actions"
                        onClick={OpenMessageOptions}
                    >
                        <BiDotsVertical />
                    </motion.div>
                )}

            </motion.div>
        </motion.div>
    );
});

export default ChatMessage;
