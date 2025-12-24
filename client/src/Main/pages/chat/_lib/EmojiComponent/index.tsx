import { motion } from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";

import "./style.scss";
import { FC, useState } from "react";

const RenderAllEmojis = lazy(() => import("./RenderAllEmojis.js"));

type EmojiComponentT = FC<{
    pushToContent: (myString: string) => void;
    onClose: () => void;
}>;

const EmojiComponent: EmojiComponentT = ({ pushToContent, onClose }) => {
    // const { emojiModal } = useAppSelector((s) => s.Chat);
    const [query, setQuery] = useState("");
    const [showEmojis, setShowEmojis] = useState(false); // Sukoon loading

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Start showing emojis after initial animation
        const timer = setTimeout(() => setShowEmojis(true), 150);

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                ref.current &&
                !ref.current.contains(target) &&
                !target.closest(".emoji-toggle-btn")
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                scale: 0.9,
                y: 10,
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
                placeholder="Search Emojis"
            />
            <div className="emoji-list-container" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {showEmojis ? (
                    <Suspense fallback={<div className="loading-emojis" style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>}>
                        <RenderAllEmojis pushToContent={pushToContent} query={query} />
                    </Suspense>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
                )}
            </div>
        </motion.div>
    );
};

export default EmojiComponent;
