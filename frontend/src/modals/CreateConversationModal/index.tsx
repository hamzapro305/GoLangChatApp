import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import useToken from "@/Hooks/useToken";
import UserService from "@/utils/UserService";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars";
import { User } from "@/Redux/slices/GlobalVars";
import { WebSocketMessageSender } from "@/utils/WebSocketMessageSender";
import BackDrop from "@/components/Backdrop";
import "./style.scss";

const CreateConverationModal = () => {
    const ws = useAppSelector((s) => s.GlobalVars.ws);
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const convs = useAppSelector((s) => s.Chat.conversations);
    const currentUser = useAppSelector((s) => s.GlobalVars.user) as User;
    const [users, setUsers] = useState<string[]>([]);
    const [token, _] = useToken();
    const dispatch = useAppDispatch();

    const query = useQuery({
        queryKey: ["users"],
        queryFn: () => {
            return UserService.GetAllUsers(token as string);
        },
    });

    const close = () => {
        dispatch(ModalVarsVarsActions.setCreateConversation(false));
    };
    const UserList = (): User[] => {
        if (!query.data) return [];
        const users = query.data
            .filter((user) => user.id !== currentUser.id)
            .slice();
        if (isGroup) return users;
        const singleChats = convs.filter((conv) => !conv.conversation.isGroup);
        console.log(singleChats);
        singleChats.forEach((conv) => {
            conv.conversation.participants.forEach((participant) => {
                users.forEach((user, i) => {
                    if (user.id === participant.userId) {
                        users.splice(i, 1);
                    }
                });
            });
        });
        return users;
    };
    const addUser = (userId: string) => {
        if (isGroup) {
            setUsers((p) => {
                if (p.includes(userId)) {
                    return p.filter((id) => id !== userId);
                } else {
                    return [...p, userId];
                }
            });
        } else {
            setUsers([userId]);
        }
    };
    const onSubmit = () => {
        if (ws) {
            if (isGroup) {
                WebSocketMessageSender.createNewGroupConversation(
                    ws,
                    [...users, currentUser.id],
                    groupName
                );
            } else {
                WebSocketMessageSender.createNewConversation(ws, [
                    ...users,
                    currentUser.id,
                ]);
            }
            close();
        }
    };
    return (
        <BackDrop onClick={close}>
            <div className="CreateConverationModal">
                <div className="CreateConverationModal-wrapper">
                    <div className="heading">Create New Chat</div>
                    <div
                        className={`isGroupChat ${isGroup ? "active" : ""}`}
                        onClick={() => {
                            setIsGroup((p) => !p);
                            setUsers([]);
                        }}
                    >
                        Group?
                    </div>
                    {isGroup && (
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Group Name"
                        />
                    )}
                    <div className="users">
                        {UserList().map((user) => {
                            const isSelected = users.includes(user.id);
                            return (
                                <div
                                    className={`user ${
                                        isSelected ? "selected" : ""
                                    }`}
                                    key={user.id}
                                    onClick={() => addUser(user.id)}
                                >
                                    <img
                                        src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                                        alt=""
                                    />
                                    <div className="name">{user.name}</div>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={onSubmit} className="submit">
                        Create
                    </button>
                </div>
            </div>
        </BackDrop>
    );
};

export default CreateConverationModal;
