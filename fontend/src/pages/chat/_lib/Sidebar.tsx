"use client";

import { Conversation } from "../../../@types/chat";
import { useAppSelector } from "../../../Redux/Hooks";

const Sidebar = () => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    const user = useAppSelector((s) => s.GlobalVars.user);
    const GetName = (conv: Conversation) => {
        if (conv.isGroup) {
            return conv.groupName;
        }
        return "Someone";
    };
    return (
        <div className="left-bar">
            <div className="actions">action</div>
            <div className="conversations">
                {conversations.map((conv) => {
                    return (
                        <div className="con" key={conv.conversation.id}>
                            {GetName(conv.conversation)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
