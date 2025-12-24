import { motion } from "motion/react";
import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { ModalVarsVarsActions } from "@/Redux/slices/ModalVars.js";
import { IoClose, IoPerson, IoShieldCheckmark, IoLogOut, IoCheckmark, IoCloseOutline } from "react-icons/io5";
import { User, GlobalVarsActions } from "@/Redux/slices/GlobalVars.js";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import apiClient from "@/utils/Axios.js";
import useToken from "@/Hooks/useToken.js";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.GlobalVars.user) as User;
    const [token] = useToken();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const CloseUserProfile = () => {
        dispatch(ModalVarsVarsActions.setUserProfile(false));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to login
    };

    const updateName = async () => {
        if (!newName || newName === user.name) {
            setIsEditingName(false);
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post("/user/updateName", { name: newName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(GlobalVarsActions.setUser({ ...user, name: newName }));
            setIsEditingName(false);
        } catch (error) {
            console.error("Failed to update name:", error);
            alert("Failed to update name. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post("/user/updatePassword", { password: newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Password updated successfully!");
            setIsChangingPassword(false);
            setNewPassword("");
        } catch (error) {
            console.error("Failed to update password:", error);
            alert("Failed to update password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            variants={BackdropVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="userProfile-modal"
        >
            <motion.div
                variants={ModalVariants}
                className="profile-settings"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="settings-sidebar">
                    <div className="sidebar-group">
                        <div className="sidebar-header">User Settings</div>
                        <div className="sidebar-item active">
                            <IoPerson size={20} />
                            My Account
                        </div>
                        <div className="sidebar-item">
                            <IoShieldCheckmark size={20} />
                            Privacy & Safety
                        </div>
                    </div>

                    <div className="sidebar-item logout" onClick={handleLogout}>
                        <IoLogOut size={20} />
                        Logout
                    </div>
                </div>

                <div className="panel">
                    <div className="close-btn" onClick={CloseUserProfile}>
                        <IoClose size={24} />
                    </div>

                    <h2>My Account</h2>

                    <div className="user-card">
                        <div className="profile-header">
                            <div className="avatar-container">
                                <img
                                    src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                                    alt="Profile"
                                />
                                <div className="edit-overlay">
                                    <MdEdit size={24} color="white" />
                                </div>
                            </div>
                            <div className="names">
                                <div className="full-name">{user?.name}</div>
                                <div className="email">{user?.email}</div>
                            </div>
                        </div>

                        <div className="card-section">
                            <div className="label">Display Name</div>
                            <div className="value-row">
                                {isEditingName ? (
                                    <div className="edit-input-group">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="actions">
                                            <button className="confirm" onClick={updateName} disabled={isLoading}>
                                                <IoCheckmark size={18} />
                                            </button>
                                            <button className="cancel" onClick={() => { setIsEditingName(false); setNewName(user.name); }}>
                                                <IoCloseOutline size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="value">{user?.name}</div>
                                        <button onClick={() => setIsEditingName(true)}>Edit</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="card-section">
                            <div className="label">Email</div>
                            <div className="value-row">
                                <div className="value">{user?.email}</div>
                                <div className="immutable-badge">Immutable</div>
                            </div>
                        </div>

                        <div className="card-section">
                            <div className="label">Password</div>
                            <div className="value-row">
                                {isChangingPassword ? (
                                    <div className="edit-input-group">
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="actions">
                                            <button className="confirm" onClick={updatePassword} disabled={isLoading}>
                                                <IoCheckmark size={18} />
                                            </button>
                                            <button className="cancel" onClick={() => { setIsChangingPassword(false); setNewPassword(""); }}>
                                                <IoCloseOutline size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="value">••••••••••••</div>
                                        <button onClick={() => setIsChangingPassword(true)}>Change Password</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BackdropVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const ModalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        },
    },
};

export default UserProfile;
