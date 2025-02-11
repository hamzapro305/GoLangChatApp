import { motion } from "motion/react";

import "./style.scss";
import AllEmojis from "../../../../utils/AllEmojis";
import { FC } from "react";

type EmojiComponentT = FC<{
    pushToContent: (myString: string) => void;
}>;

const EmojiComponent: EmojiComponentT = ({ pushToContent }) => {
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
            <div className="emojis">
                {AllEmojis.map((emoji) => {
                    return (
                        <motion.div
                            className="emoji"
                            key={emoji.emoji}
                            onClick={() => pushToContent(emoji.emoji)}
                            whileHover={{
                                background: "#6a309381",
                            }}
                        >
                            {emoji.emoji}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default EmojiComponent;
