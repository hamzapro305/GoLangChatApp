import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import "./index.scss";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { MdReply, MdContentCopy, MdForward, MdDeleteOutline, MdStarOutline } from "react-icons/md";
import apiClient from "@/utils/Axios.js";

const MessageOptions = () => {
    const dispatch = useAppDispatch();
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const user = useAppSelector((s) => s.GlobalVars.user);

    const closeModal = () => {
        dispatch(
            ChatActions.setSelectedChat({
                messageOptions: null,
            })
        );
    };

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const messageId = selectedChat?.messageOptions;
    const conversation = conversations.find(c => c.conversation.id === selectedChat?.id);
    const message = conversation?.messages.find(m => m.id === messageId);
    const isMine = message?.senderId === user?.id;

    const handleDelete = async () => {
        if (!message) return;
        try {
            await apiClient.delete(`/message/${message.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(
                ChatActions.deleteMessage({
                    conversationId: message.conversationId,
                    messageId: message.id,
                })
            );
            closeModal();
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    const handleReply = () => {
        if (!message) return;
        dispatch(ChatActions.setSelectedChat({ replyingTo: message, messageOptions: null }));
    };

    const handleForward = () => {
        if (!message) return;
        dispatch(ChatActions.setSelectedChat({ forwardingMessage: message, messageOptions: null }));
    }

    const actions = [
        { icon: <MdReply />, label: "Reply", onClick: handleReply },
        {
            icon: <MdContentCopy />, label: "Copy Text", onClick: () => {
                if (message?.content) {
                    // Strip HTML for copying
                    const tmp = document.createElement("DIV");
                    tmp.innerHTML = message.content;
                    const text = tmp.textContent || tmp.innerText || "";
                    navigator.clipboard.writeText(text);
                    closeModal();
                }
            }
        },
        { icon: <MdForward />, label: "Forward", onClick: handleForward },
        { icon: <MdStarOutline />, label: "Star", onClick: () => { closeModal(); } },
        { icon: <MdDeleteOutline />, label: "Delete", onClick: handleDelete, danger: true, hide: !isMine },
    ];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`MessageOptions ${isMine ? "mine" : "others"}`}
        >
            <div className="options-list">
                {actions.filter(a => !a.hide).map((action, i) => (
                    <div
                        key={i}
                        className={`action-item ${action.danger ? 'danger' : ''}`}
                        onClick={action.onClick}
                    >
                        <div className="icon">{action.icon}</div>
                        <div className="label">{action.label}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MessageOptions;
