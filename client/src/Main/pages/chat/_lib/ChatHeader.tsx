import { useState } from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars.js";
import { User } from "@/Redux/slices/GlobalVars.js";

const Routes = [
    {
        title: "Inbox",
        path: "/inbox",
    },
    {
        title: "Test",
        path: "/test",
    },
];

const ChatHeader = () => {
    const [currentRoute, setCurrentRoute] = useState("/inbox");
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
            <div className="logo">Logo</div>
            <nav>
                <ul>
                    {Routes.map((r) => (
                        <li
                            className="route"
                            key={r.path}
                            onClick={() => setCurrentRoute(r.path)}
                        >
                            <span>{r.title}</span>
                            {currentRoute === r.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="underline"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="user-profile" onClick={OpenUserProfile}>
                <div className="pp">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="name">{CurrentUser?.name}</div>
            </div>
        </div>
    );
};

export default ChatHeader;
