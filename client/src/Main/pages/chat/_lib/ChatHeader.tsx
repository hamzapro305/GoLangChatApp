import { useState } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars.js";
import { User } from "@/Redux/slices/GlobalVars.js";

import { IoChevronDown } from "react-icons/io5";

const ChatHeader = () => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;
    const dispatch = useAppDispatch();
    const OpenUserProfile = () => {
        dispatch(
            ModalVarsVarsActions.setUserProfile(
                true
            )
        )
    }
    return (
        <div className="chat-page-header">
            <div className="logo">Connect</div>
            <div className="user-profile" onClick={OpenUserProfile}>
                <div className="pp">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                    <div className="status-indicator"></div>
                </div>
                <div className="info">
                    <div className="name">{CurrentUser?.name}</div>
                    <div className="status">Online</div>
                </div>
                <div className="arrow">
                    <IoChevronDown />
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
