"use client";

import { AnimatePresence } from "motion/react";
import { useAppSelector } from "../Redux/Hooks";
import CreateConverationModal from "./CreateConversationModal";
import UserProfile from "./UserProfile";

const ModalsInit = () => {
    const { createConversation, userProfile } = useAppSelector((s) => s.ModalVars);
    return (
        <div className="_M_O_D_A_L_S_____I_N_I_T_">
            <AnimatePresence mode="wait" presenceAffectsLayout>
                {createConversation && <CreateConverationModal />}
                {userProfile && <UserProfile />}
            </AnimatePresence>
        </div>
    );
};

export default ModalsInit;
