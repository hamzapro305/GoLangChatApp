import { motion } from "motion/react";
import "./style.scss";
import { useAppDispatch } from "@/Redux/Hooks.js";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars.js";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const CloseUserProfile = () => {
        dispatch(ModalVarsVarsActions.setUserProfile(false));
    };
    return (
        <motion.div
            variants={ModalVariants}
            onClick={CloseUserProfile}
            initial="hidden"
            exit="hidden"
            animate="show"
            className="userProfile-modal"
        >
            <div className="profile-settings">
                <div className="settings-sidebar"></div>
                <div className="panel"></div>
            </div>
        </motion.div>
    );
};

const ModalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2, ease: "easeInOut" },
    },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2, ease: "easeInOut" },
    },
};

export default UserProfile;
