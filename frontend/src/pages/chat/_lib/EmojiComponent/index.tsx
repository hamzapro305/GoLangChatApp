import { motion } from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";

import "./style.scss";
import { FC, useState } from "react";

const RenderAllEmojis = lazy(() => import("./RenderAllEmojis"));

type EmojiComponentT = FC<{
    pushToContent: (myString: string) => void;
    onClose: () => void;
}>;

const EmojiComponent: EmojiComponentT = ({ pushToContent }) => {
    // const { emojiModal } = useAppSelector((s) => s.Chat);
    const [query, setQuery] = useState("");

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                // onClose();
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
            className="EmojiComponent"
        >
            <div className="emojis-head">Emojis</div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="searchbar"
                placeholder="Search Emoji"
            />
            <Suspense fallback="Loading">
                <RenderAllEmojis pushToContent={pushToContent} query={query} />
            </Suspense>
        </motion.div>
    );
};

export default EmojiComponent;
