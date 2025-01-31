import { motion } from "motion/react";
import "./index.scss";
import { useAppDispatch } from "../../../../Redux/Hooks";
import { ChatActions } from "../../../../Redux/slices/ChatSlice";

const MessageOptions = () => {
    const dispatch = useAppDispatch();
    const closeModal = () => {
        dispatch(ChatActions.setMessageOptions(null));
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{
                opacity: 0,
                scale: 0,
                transition: {
                    duration: 0.2,
                },
            }}
            className="MessageOptions"
        >
            <div className="head">
                <div className="title">Message Options</div>
                <button onClick={closeModal}>X</button>
            </div>
            <div className="emojis"></div>
        </motion.div>
    );
};

export default MessageOptions;
