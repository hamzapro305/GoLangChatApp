import AllEmojis from "@/utils/AllEmojis.js";
import { motion } from "motion/react";
import { FC, useMemo, memo, useState, useEffect, useRef } from "react";

type RenderAllEmojisT = FC<{
    query: string;
    pushToContent: (emoji: string) => void;
}>;

const CHUNK_SIZE = 120; // Load 120 emojis at a time (about 20 rows of 6)

const RenderAllEmojis: RenderAllEmojisT = memo(({ pushToContent, query }) => {
    const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
    const observerTarget = useRef<HTMLDivElement>(null);

    const filteredEmojis = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = AllEmojis.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery)
        );
        // Reset visible count when query changes
        setVisibleCount(CHUNK_SIZE);
        return filtered;
    }, [query]);

    // Intersection Observer to load more emojis on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredEmojis.length) {
                    setVisibleCount((prev) => prev + CHUNK_SIZE);
                }
            },
            { threshold: 0.1, rootMargin: '100px' } // Pre-load when within 100px
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, filteredEmojis.length]);

    const emojisToShow = useMemo(() => {
        return filteredEmojis.slice(0, visibleCount);
    }, [filteredEmojis, visibleCount]);

    return (
        <div className="emojis">
            {emojisToShow.map((emoji, index) => (
                <motion.div
                    className="emoji"
                    key={`${emoji.emoji}-${index}`}
                    onClick={() => pushToContent(emoji.emoji)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: (index % CHUNK_SIZE) * 0.001 }} // Subtle stagger for chunk load
                >
                    {emoji.emoji}
                </motion.div>
            ))}

            {/* Target for Intersection Observer */}
            {visibleCount < filteredEmojis.length && (
                <div ref={observerTarget} style={{ height: '20px', width: '100%', gridColumn: '1 / -1' }} />
            )}

            {filteredEmojis.length === 0 && (
                <div className="no-emojis" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', opacity: 0.5 }}>
                    No emojis found
                </div>
            )}
        </div>
    );
});

export default RenderAllEmojis;
