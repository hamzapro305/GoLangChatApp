import React from "react";
import { useAppSelector } from "../../../Redux/Hooks";
import { User } from "../../../Redux/slices/GlobalVars";

const ChatHeader = () => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;
    return (
        <div className="chat-page-header">
            <div className="logo">Logo</div>
            <nav>
                <ul>
                    <li>Inbox</li>
                    <li>Test</li>
                </ul>
            </nav>
            <div className="user-profile">
                <div className="pp">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="name">{CurrentUser?.email}</div>
            </div>
        </div>
    );
};

export default ChatHeader;
