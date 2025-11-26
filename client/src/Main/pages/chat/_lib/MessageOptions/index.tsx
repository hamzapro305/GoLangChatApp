import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import "./index.scss";
import { useAppDispatch } from "@/Redux/Hooks.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";

const MessageOptions = () => {
    const dispatch = useAppDispatch();
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

    return (
        <motion.div
            ref={ref}
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
