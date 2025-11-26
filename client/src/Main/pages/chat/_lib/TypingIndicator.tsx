import { useAnyUser } from "@/Hooks/useUser.js";
import { useAppSelector } from "@/Redux/Hooks.js";
import { FC } from "react";

type TypingIndicatorT = FC<{
    selectedChat: string;
}>;
const TypingIndicator: TypingIndicatorT = ({ selectedChat }) => {
    const conversations = useAppSelector((s) => s.Chat.conversations);
    const conversation = conversations.filter(
        (conv) => conv.conversation.id === selectedChat
    )[0];
    if (conversation && conversation.usersTyping.length) {
        return (
            <div
                className="TypingIndicator"
                style={{
                    display: "flex",
                    gap: "5px",
                    color: "#41d141",
                }}
            >
                {conversation.usersTyping.map((user) => (
                    <UserInfo userId={user} key={user} />
                ))}
                <span>Typing...</span>
            </div>
        );
    } else {
        return <div className="TypingIndicator"></div>;
    }
};

const UserInfo: FC<{ userId: string }> = ({ userId }) => {
    const queryUser = useAnyUser(userId);
    return <span className="userName">{queryUser?.name}</span>;
};

export default TypingIndicator;
