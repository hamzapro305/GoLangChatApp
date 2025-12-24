import React from "react";
import { motion } from "motion/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

type Props = {
    deletedCount: number;
    totalCount: number;
    isOpen: boolean;
};

const DeleteChatModal: React.FC<Props> = ({ deletedCount, totalCount, isOpen }) => {
    if (!isOpen) return null;

    const percentage = totalCount > 0 ? Math.round((deletedCount / totalCount) * 100) : 0;

    return (
        <div className="media-preview-modal-overlay">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="delete-chat-modal"
                style={{
                    background: "rgba(20, 20, 20, 0.8)",
                    backdropFilter: "blur(12px)",
                    padding: "2rem",
                    borderRadius: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.5rem",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    width: "300px",
                }}
            >
                <div style={{ position: "relative" }}>
                    <AiOutlineLoading3Quarters size={60} color="#ef4444" />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <FaTrash size={20} color="#ef4444" />
                    </div>
                </div>

                <div style={{ textAlign: "center" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Deleting Chat</h3>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>
                        Please wait...
                    </p>
                </div>

                <div style={{ width: "100%" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        fontSize: "0.8rem",
                        opacity: 0.8
                    }}>
                        <span>Progress</span>
                        <span>{deletedCount} / {totalCount}</span>
                    </div>
                    <div style={{
                        width: "100%",
                        height: "8px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        overflow: "hidden"
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                            style={{
                                height: "100%",
                                background: "#ef4444",
                                borderRadius: "4px"
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteChatModal;
