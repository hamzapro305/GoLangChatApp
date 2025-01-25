import { motion } from "motion/react";
import "./style.scss";

const EmojiComponent = () => {
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
            className="EmojiComponent"
        >
            <div className="emojis-head">Emojis</div>
            <input
                type="text"
                className="searchbar"
                placeholder="Search Emoji"
            />
            <div className="emojis"></div>
        </motion.div>
    );
};

export default EmojiComponent;
