import { useEffect, useState, useCallback } from "react";
import { MdOutlineEmojiEmotions, MdFormatUnderlined } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { AnimatePresence, motion } from "motion/react";
import { nanoid } from "@reduxjs/toolkit";
import MessageOptions from "./MessageOptions/index.js";
import EmojiComponent from "./EmojiComponent/index.js";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import useUser from "@/Hooks/useUser.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { ChatNewMessage } from "@/@types/chat.js";
import { WebSocketMessageSender } from "@/utils/WebSocketMessageSender.js";
import { GoBold, GoItalic, GoListUnordered } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import { FaImage, FaFileAlt, FaVideo } from "react-icons/fa";
import { useRef } from "react";
import axios from "axios";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

const ChatFoot = () => {
    const dispatch = useAppDispatch();
    const { selectedChat } = useAppSelector((s) => s.Chat);
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useUser();

    const handleAttachmentClick = () => {
        setShowAttachmentMenu(!showAttachmentMenu);
    };

    const handleFileClick = (type: string) => {
        if (fileInputRef.current) {
            // Filter by type if needed
            if (type === "image") fileInputRef.current.accept = "image/*";
            else if (type === "video") fileInputRef.current.accept = "video/*";
            else fileInputRef.current.accept = "*/*";

            fileInputRef.current.click();
        }
        setShowAttachmentMenu(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedChat || !ws || !user) return;

        const tempId = nanoid(10);
        const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
        const localUrl = URL.createObjectURL(file);

        // Optimistic UI update
        const tempMessage: ChatNewMessage = {
            conversationId: selectedChat.id,
            content: localUrl,
            tempId: tempId,
            status: "loading",
            senderId: user.id,
            type: type,
        };

        dispatch(
            ChatActions.addNewMeesageToSending({
                conversationId: selectedChat.id,
                message: tempMessage,
            })
        );

        const formData = new FormData();
        formData.append("file", file);

        try {
            const tokenWithQuotes = localStorage.getItem("token");
            const token = tokenWithQuotes ? JSON.parse(tokenWithQuotes) : "";

            const res = await axios.post("http://localhost:3001/api/v1/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.url) {
                WebSocketMessageSender.createNewMessage(ws, {
                    conversationId: selectedChat.id,
                    content: res.data.url,
                    tempId: tempId,
                    type: type,
                });
            }
        } catch (error) {
            console.error("Upload failed", error);
            dispatch(
                ChatActions.setMessageStatusToSending({
                    conversationId: selectedChat.id,
                    tempId: tempId,
                    status: "failed",
                })
            );
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            Placeholder.configure({
                placeholder: 'Type Message...',
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== '<p></p>') {
                setIsTyping(true);
                if (typingTimeout) clearTimeout(typingTimeout);
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
                setTypingTimeout(timeout);
            } else {
                setIsTyping(false);
            }
        },
    });

    const TypingIndicator = useCallback((isTypingValue: boolean) => {
        if (!ws || !selectedChat) return;
        if (isTypingValue) {
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
    }, [ws, selectedChat]);

    useEffect(() => {
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [typingTimeout]);

    useEffect(() => {
        TypingIndicator(isTyping);
    }, [isTyping, TypingIndicator]);

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
        editor?.commands.insertContent(myString);
    };

    const SendMessage = useCallback(() => {
        if (!editor) return;
        const htmlContent = editor.getHTML();
        if (!htmlContent || htmlContent === '<p></p>') return;

        if (ws && selectedChat && user) {
            let message: ChatNewMessage = {
                conversationId: selectedChat.id,
                content: htmlContent,
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
                content: htmlContent,
                conversationId: selectedChat.id,
                tempId: message.tempId,
            });
            editor.commands.clearContent();
        }
    }, [editor, ws, selectedChat, user, dispatch]);

    useEffect(() => {
        if (editor) {
            editor.setOptions({
                editorProps: {
                    handleKeyDown: (view, event) => {
                        if (event.code === 'Enter' && !event.shiftKey) {
                            event.preventDefault(); // Crucial to prevent TipTap from adding a new line
                            SendMessage();
                            return true;
                        }
                        return false;
                    },
                },
            });
        }
    }, [editor, SendMessage]);

    return (
        <div className="chat-foot">
            <div className="box tiptap-container">
                <div className="rich-toolbar">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={editor?.isActive('bold') ? 'active' : ''}
                        title="Bold"
                    ><GoBold /></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={editor?.isActive('italic') ? 'active' : ''}
                        title="Italic"
                    ><GoItalic /></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={editor?.isActive('underline') ? 'active' : ''}
                        title="Underline"
                    ><MdFormatUnderlined /></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={editor?.isActive('bulletList') ? 'active' : ''}
                        title="Bullet List"
                    ><GoListUnordered /></button>
                </div>

                <EditorContent editor={editor} className="tiptap-editor" />

                <div className="options">
                    <div className="actions">
                        <div className="emoji emoji-toggle-btn" onClick={toggleEmojiModal}>
                            <MdOutlineEmojiEmotions />
                        </div>
                        <div className="attachment" onClick={handleAttachmentClick}>
                            <GrAttachment />
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                        <AnimatePresence>
                            {showAttachmentMenu && (
                                <motion.div
                                    className="attachment-menu"
                                    initial={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10, x: 20 }}
                                >
                                    <div className="item" onClick={() => handleFileClick("image")}>
                                        <div className="icon photos"><FaImage /></div>
                                        <span>Photos</span>
                                    </div>
                                    <div className="item" onClick={() => handleFileClick("video")}>
                                        <div className="icon video"><FaVideo /></div>
                                        <span>Videos</span>
                                    </div>
                                    <div className="item" onClick={() => handleFileClick("document")}>
                                        <div className="icon docs"><FaFileAlt /></div>
                                        <span>Documents</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="send-btn" onClick={SendMessage}>
                        <IoSend size={20} />
                    </div>
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
