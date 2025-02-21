import useToken from "@/Hooks/useToken";
import { useAppSelector } from "@/Redux/Hooks";
import UserService from "@/utils/UserService";
import { useQuery } from "@tanstack/react-query";
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
    const [token, _] = useToken();
    const query = useQuery({
        queryKey: [userId],
        queryFn: () => {
            return UserService.fetchUserById(userId, token as string);
        },
        staleTime: Infinity,
        placeholderData: {
            createdAt: "",
            email: "User name",
            id: "13",
            name: "Someone",
        },
    });
    return <span className="userName">{query.data?.email}</span>;
};

export default TypingIndicator;
