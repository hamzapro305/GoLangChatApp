import { motion } from "motion/react";

const GlobalLoading = () => {
    return (
        <div style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a", // Dark background
            gap: "20px"
        }}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)"
                }}
            >
                <span style={{ color: "white", fontSize: "2rem", fontWeight: "800" }}>N</span>
            </motion.div>

            <div style={{ textAlign: "center" }}>
                <h2 style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: 0,
                    letterSpacing: "1px"
                }}>
                    Nebula Chat
                </h2>
                <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "8px" }}
                >
                    Initializing connection...
                </motion.p>
            </div>

            <div style={{
                width: "200px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "10px"
            }}>
                <motion.div
                    animate={{
                        x: ["-100%", "100%"]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: "50%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, #7c3aed, transparent)"
                    }}
                />
            </div>
        </div>
    );
};

export default GlobalLoading;
