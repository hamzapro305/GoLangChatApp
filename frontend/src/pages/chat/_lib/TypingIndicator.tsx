import { useAnyUser } from "@/Hooks/useUser";
import { useAppSelector } from "@/Redux/Hooks";
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
                    gap: "10px",
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
    return <span className="userName">{queryUser?.email}</span>;
};

export default TypingIndicator;
