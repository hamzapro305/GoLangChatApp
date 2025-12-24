import { FC, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoClose, IoSend } from "react-icons/io5";
import { FaCrop, FaEdit } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";

interface MediaPreviewModalProps {
    file: File;
    localUrl: string;
    onClose: () => void;
    onSend: (caption: string) => void;
}

const MediaPreviewModal: FC<MediaPreviewModalProps> = ({ file, localUrl, onClose, onSend }) => {
    const [caption, setCaption] = useState("");
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    return (
        <motion.div
            className="MediaPreviewModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="modal-header">
                <div className="left">
                    <button className="close-btn" onClick={onClose} title="Cancel">
                        <IoClose size={24} />
                    </button>
                    <span className="file-name">{file.name}</span>
                </div>
                <div className="tools">
                    <button className="tool-btn" title="Crop"><FaCrop /></button>
                    <button className="tool-btn" title="Edit"><FaEdit /></button>
                </div>
            </div>

            <div className="content-preview">
                {isImage && <img src={localUrl} alt="Preview" />}
                {isVideo && <video src={localUrl} controls autoPlay />}
                {!isImage && !isVideo && (
                    <div className="file-placeholder">
                        <div className="file-icon">📁</div>
                        <span>{file.name}</span>
                    </div>
                )}
            </div>

            <div className="modal-footer">
                <div className="caption-container">
                    <button className="emoji-btn">
                        <MdOutlineEmojiEmotions size={24} />
                    </button>
                    <input
                        type="text"
                        placeholder="Add a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSend(caption);
                        }}
                        autoFocus
                    />
                </div>
                <button className="send-action-btn" onClick={() => onSend(caption)}>
                    <IoSend size={24} />
                </button>
            </div>
        </motion.div>
    );
};

export default MediaPreviewModal;
