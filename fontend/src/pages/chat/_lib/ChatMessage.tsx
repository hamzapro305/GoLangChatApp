import { FC } from "react";
import { ChatMessage as ChatMessageType } from "../../../@types/chat";
import { useAppSelector } from "../../../Redux/Hooks";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import useToken from "../../../Hooks/useToken";
import UserService from "../../../utils/UserService";

type Props = {
    Message: ChatMessageType;
};
const ChatMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const isMine = user?.id === Message.senderId;
    const [token, _] = useToken();
    const query = useQuery({
        queryKey: [Message.senderId],
        queryFn: () => {
            return UserService.fetchUserById(Message.senderId, token as string);
        },
        staleTime: Infinity,
        placeholderData: {
            createdAt: "",
            email: "User name",
            id: "13",
            name: "Someone",
        },
    });
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                x: isMine ? -30 : 30,
            }}
            whileInView={{
                x: isMine ? -20 : 20,
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.6,
                    damping: 10,
                    bounce: 10,
                },
            }}
            initial={{ opacity: 0, x: isMine ? 20 : -20, scale: 0 }}
            // viewport={{ once: true }}
            className={`msg ${isMine ? "mine" : ""}`}
        >
            <div className="content">{Message.content}</div>
            <div className="name">{query?.data?.email}</div>
            <div className="options"></div>
        </motion.div>
    );
};

export default ChatMessage;
