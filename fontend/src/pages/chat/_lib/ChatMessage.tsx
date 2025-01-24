import { FC } from "react";
import { ChatMessage as ChatMessageType } from "../../../@types/chat";
import { useAppSelector } from "../../../Redux/Hooks";

type Props = {
    Message: ChatMessageType;
};
const ChatMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    return (
        <div
            className={`msg ${user?.id === Message.senderId ? "mine" : ""}`}
        >
            <div className="content">{Message.content}</div>
            <div className="name">User Name</div>
        </div>
    );
};

export default ChatMessage;
