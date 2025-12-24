import React, { FC, ReactNode } from "react";
import { motion } from "motion/react";

type Component = FC<{
    children?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    Animation?: any;
}>;
const BackDrop: Component = ({ children, onClick, Animation }) => (
    <motion.div
        className="BackDrop"
        {...(Animation ?? PageAnimation)}
        style={Styling}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onClick?.(e);
            }
        }}
    >
        {children ?? ""}
    </motion.div>
);

const Styling = {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 1000,
    height: "100vh",
};

const PageAnimation = {
    variants: {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.5,
            },
        },
        show: {
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    },
    initial: "hidden",
    animate: "show",
    exit: "hidden",
};

export default BackDrop;
