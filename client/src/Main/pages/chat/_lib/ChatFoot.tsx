import { useEffect, useState, useCallback } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { AnimatePresence } from "motion/react";
import { nanoid } from "@reduxjs/toolkit";
import MessageOptions from "./MessageOptions/index.js";
import EmojiComponent from "./EmojiComponent/index.js";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import useUser from "@/Hooks/useUser.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { ChatNewMessage } from "@/@types/chat.js";
import { WebSocketMessageSender } from "@/utils/WebSocketMessageSender.js";

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
    const user = useUser();

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
                    ><b>B</b></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={editor?.isActive('italic') ? 'active' : ''}
                        title="Italic"
                    ><i>I</i></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={editor?.isActive('underline') ? 'active' : ''}
                        title="Underline"
                    ><u>U</u></button>
                    <button
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={editor?.isActive('bulletList') ? 'active' : ''}
                        title="Bullet List"
                    >• List</button>
                </div>

                <EditorContent editor={editor} className="tiptap-editor" />

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
