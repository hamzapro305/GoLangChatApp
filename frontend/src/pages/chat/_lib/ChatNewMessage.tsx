import { FC, useState } from "react";
import { ChatNewMessage as ChatNewMessageT } from "../../../@types/chat";
import { useAppSelector } from "../../../Redux/Hooks";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import useToken from "../../../Hooks/useToken";
import UserService from "../../../utils/UserService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { MdDoneAll } from "react-icons/md";

type Props = {
    Message: ChatNewMessageT;
};
const ChatNewMessage: FC<Props> = ({ Message }) => {
    const user = useAppSelector((s) => s.GlobalVars.user);
    const isMine = user?.id === Message.senderId;
    const [token, _] = useToken();
    const [isHovering, setIsHovering] = useState(false);
    // const _dispatch = useAppDispatch();
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
    // const removeMessage = (Message: ChatNewMessageT) => {
    //     if (Message.status === "loading") {
    //         dispatch(
    //             ChatActions.removeMeesageToSending({
    //                 conversationId: Message.tempId,
    //                 tempId: Message.tempId,
    //             })
    //         );
    //     }
    // };
    const getIcon = () => {
        switch (Message.status) {
            case "failed":
                return <RxCrossCircled fontSize={18} color="red" />;
            case "loading":
                return (
                    <AiOutlineLoading3Quarters
                        className="loading"
                        fontSize={15}
                    />
                );
            case "sent":
                return <MdDoneAll color="blue" fontSize={20} />;
            default:
                break;
        }
    };

    const msgXPositttion = isHovering ? 70 : 60;
    return (
        <motion.div
            className={`msg ${isMine ? "mine" : ""}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            animate={{
                background: isHovering ? "#6a309344" : "#6a309300",
                transition: {
                    duration: 0.1,
                },
            }}
        >
            <motion.div
                whileInView={{
                    x: isMine ? -msgXPositttion : msgXPositttion,
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration: 0.4,
                        damping: 100,
                        bounce: 10,
                    },
                }}
                initial={{ opacity: 0, x: isMine ? 20 : -20, scale: 0 }}
                viewport={{ once: true }}
                className={`msg-wrapper ${isMine ? "mine" : ""}`}
            >
                <div className="content">{Message.content}</div>
                <div className="profile">
                    <img
                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                        alt=""
                    />
                </div>
                <div className="name">{query?.data?.email}</div>
                <div className="status">
                    <div className="icon">{getIcon()}</div>
                </div>
                <div className="options"></div>
            </motion.div>
        </motion.div>
    );
};

export default ChatNewMessage;
