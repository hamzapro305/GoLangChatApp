"use client";

import { useAppSelector } from "@/Redux/Hooks";
import React from "react";

const Sidebar = () => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    return (
        <div className="left-bar">
            <div className="actions">action</div>
            <div className="conversations">
                {conversations.map((conv) => {
                    return (
                        <div className="con" key={conv.conversation.id}>
                            {conv.conversation.leaderId}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
