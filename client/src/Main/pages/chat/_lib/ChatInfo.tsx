import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ChatActions } from "@/Redux/slices/ChatSlice.js";
import { IoClose } from "react-icons/io5";
import { SimpleConversation } from "@/@types/chat.js";
import UserService from "@/utils/UserService.js";
import { User } from "@/Redux/slices/GlobalVars.js";
import { useAnyUser } from "@/Hooks/useUser.js";
import { MdGroup, MdNotifications, MdBlock, MdDelete } from "react-icons/md";

const ChatInfo = () => {
    const { selectedChat, conversations } = useAppSelector((s) => s.Chat);
    const dispatch = useAppDispatch();

    const selectedConv = conversations.find((conv) => {
        return conv.conversation.id === selectedChat?.id;
    });

    const closeInfo = () => {
        dispatch(ChatActions.setSelectedChat({ chatInfo: false }));
    };

    if (!selectedConv) return null;

    return (
        <motion.div
            className="chat-info"
        >
            <div className="info-header">
                <div className="close-btn" onClick={closeInfo}>
                    <IoClose size={24} />
                </div>
                <h3>Contact Info</h3>
            </div>

            <div className="info-body">
                <ChatProfileInfo selectedConv={selectedConv.conversation} />

                <div className="info-sections">
                    <div className="info-card">
                        <div className="item">
                            <MdNotifications size={22} />
                            <span>Mute Notifications</span>
                            <div className="toggle"></div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h4>Media, Links and Docs</h4>
                        <div className="media-preview">
                            <div className="media-item"></div>
                            <div className="media-item"></div>
                            <div className="media-item"></div>
                        </div>
                    </div>

                    {selectedConv.conversation.isGroup && (
                        <GroupMembers participants={selectedConv.conversation.participants} />
                    )}

                    <div className="info-card dangerous">
                        <div className="item">
                            <MdBlock size={22} />
                            <span>Block Contact</span>
                        </div>
                        <div className="item">
                            <MdDelete size={22} />
                            <span>Delete Chat</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ChatProfileInfo = ({ selectedConv }: { selectedConv: any }) => {
    const CurrentUser = useAppSelector((s) => s.GlobalVars.user) as User;

    if (selectedConv.isGroup) {
        return (
            <div className="main-profile">
                <div className="large-avatar">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConv.groupName}`} alt="" />
                </div>
                <h2>{selectedConv.groupName}</h2>
                <p>Group • {selectedConv.participants.length} Participants</p>
            </div>
        );
    }

    const requiredParticipant = UserService.GetChatParticipant(
        CurrentUser,
        selectedConv as SimpleConversation
    );
    const queryUser = useAnyUser(requiredParticipant.userId);

    return (
        <div className="main-profile">
            <div className="large-avatar">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${queryUser?.name || "U"}`} alt="" />
            </div>
            <h2>{queryUser?.name || "Loading..."}</h2>
            <p>~ {queryUser?.email || "No status available"}</p>
        </div>
    );
};

const GroupMembers = ({ participants }: { participants: any[] }) => {
    return (
        <div className="info-card">
            <div className="section-head">
                <h4>{participants.length} Participants</h4>
                <MdGroup />
            </div>
            <div className="members-list">
                {participants.map((p) => (
                    <MemberItem key={p.userId} userId={p.userId} />
                ))}
            </div>
        </div>
    );
};

const MemberItem = ({ userId }: { userId: string }) => {
    const user = useAnyUser(userId);
    return (
        <div className="member-item">
            <div className="mini-avatar">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "U"}`} alt="" />
            </div>
            <div className="member-info">
                <span className="name">{user?.name || "Loading..."}</span>
                <span className="bio">Active</span>
            </div>
        </div>
    );
};

export default ChatInfo;
