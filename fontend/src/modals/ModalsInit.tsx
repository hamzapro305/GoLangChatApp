"use client";

import { AnimatePresence } from "motion/react";
import { useAppSelector } from "../Redux/Hooks";
import CreateConverationModal from "./CreateConversationModal";

const ModalsInit = () => {
    const { createConversation } = useAppSelector((s) => s.ModalVars);
    return (
        <div className="_M_O_D_A_L_S_____I_N_I_T_">
            <AnimatePresence mode="wait" presenceAffectsLayout>
                {createConversation && <CreateConverationModal />}
            </AnimatePresence>
        </div>
    );
};

export default ModalsInit;
