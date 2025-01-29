import { FC } from "react";
import {
    ChatLoadingMessage,
    ChatMessage as ChatMessageType,
} from "../../../@types/chat";
import { useAppDispatch, useAppSelector } from "../../../Redux/Hooks";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import useToken from "../../../Hooks/useToken";
import UserService from "../../../utils/UserService";
import { ChatActions } from "../../../Redux/slices/ChatSlice";

type Props = {
    Message: ChatMessageType | ChatLoadingMessage;
};
const ChatMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const isMine = user?.id === Message.senderId;
    const [token, _] = useToken();
    const dispatch = useAppDispatch();
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
    const removeMessage = (Message: ChatLoadingMessage) => {
        if (Message.status === "loading") {
            dispatch(
                ChatActions.removeMeesageToSending({
                    conversationId: Message.tempId,
                    tempId: Message.tempId,
                })
            );
        }
    };
    return (
        <motion.div
            whileHover={{
                x: isMine ? -70 : 70,
            }}
            whileInView={{
                x: isMine ? -60 : 60,
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
            <div className="profile">
                <img
                    src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                    alt=""
                />
            </div>
            <div className="name">{query?.data?.email}</div>
            <div className="options"></div>
        </motion.div>
    );
};

export default ChatMessage;
