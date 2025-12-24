import AllEmojis from "@/utils/AllEmojis.js";
import { motion } from "motion/react";
import { FC, useMemo, memo } from "react";

type RenderAllEmojisT = FC<{
    query: string;
    pushToContent: (emoji: string) => void;
}>;

const RenderAllEmojis: RenderAllEmojisT = memo(({ pushToContent, query }) => {
    const filteredEmojis = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        return AllEmojis.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery)
        );
    }, [query]);

    return (
        <div className="emojis">
            {filteredEmojis.map((emoji) => (
                <motion.div
                    className="emoji"
                    key={emoji.emoji}
                    onClick={() => pushToContent(emoji.emoji)}
                >
                    {emoji.emoji}
                </motion.div>
            ))}
        </div>
    );
});

export default RenderAllEmojis;
