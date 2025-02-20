import { motion } from "motion/react";
import AllEmojis from "../../../../utils/AllEmojis";
import { FC } from "react";

type RenderAllEmojisT = FC<{
    query: string;
    pushToContent: (emoji: string) => void;
}>;
const RenderAllEmojis: RenderAllEmojisT = ({ pushToContent, query }) => {
    return (
        <div className="emojis">
            {AllEmojis.filter((item) => item.name.includes(query)).map(
                (emoji) => {
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
                }
            )}
        </div>
    );
};

export default RenderAllEmojis;
