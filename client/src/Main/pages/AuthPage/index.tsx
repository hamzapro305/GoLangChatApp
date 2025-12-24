import { FC, useEffect, useState } from "react";
import "./style.scss";
import useToken from "@/Hooks/useToken.js";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/Redux/Hooks.js";
import UserService from "@/utils/UserService.js";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars.js";
import { Auth } from "@/utils/Auth.js";
import { Toast } from "@/components/HSToast.js";

const AuthPage = () => {
    const [token, setToken] = useToken();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useAppDispatch();

    const VerifyToken = async (_token: string) => {
        try {
            await UserService.GetCurrentUser(_token);
            dispatch(GlobalVarsActions.setIsLoading(false));
            dispatch(GlobalVarsActions.setIsLogin(true));
            navigate({
                pathname: "/chat",
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (token) VerifyToken(token);
    }, [token]);

    return (
        <div className="auth-page">
            <div className="auth-page-wrapper">
                <div className="title">Chat App</div>
                <div className="subtitle">
                    {isLogin ? "Welcome back! Please login to your account." : "Join us! Create an account to start chatting."}
                </div>
                {isLogin ? (
                    <LoginForm setToken={setToken} />
                ) : (
                    <RegisterForm setToken={setToken} />
                )}
                <button
                    className="change"
                    onClick={() => setIsLogin((p) => !p)}
                >
                    {isLogin ? "don't have account? register here" : "already have account? login here"}
                </button>
            </div>
        </div>
    );
};

type SetTokenT = FC<{ setToken: (token: string) => void }>;
const LoginForm: SetTokenT = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const SubmitLogin = async () => {
        if (!email || !password) return Toast.ErrorToast("Please fill all fields");
        setLoading(true);
        try {
            const data = await Auth.Login(email, password);

            if ("token" in data) {
                setToken(data.token);
            } else {
                console.error("Login error:", data.error);
                Toast.ErrorToast(data.error);
            }
        } catch (error) {
            console.error("Unexpected error in SubmitLogin:", error);
            Toast.ErrorToast("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="form">
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-global" onClick={SubmitLogin} disabled={loading}>
                {loading ? <div className="loader"></div> : "Login"}
            </button>
        </div>
    );
};
const RegisterForm: SetTokenT = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);

    const SubmitRegister = async () => {
        if (!email || !password || !userName) return Toast.ErrorToast("Please fill all fields");
        setLoading(true);
        try {
            const data = await Auth.Register(userName, email, password);

            if ("token" in data) {
                setToken(data.token);
            } else {
                console.error("Login error:", data.error);
                Toast.ErrorToast(data.error);
            }
        } catch (error) {
            console.error("Unexpected error in SubmitRegister:", error);
            Toast.ErrorToast("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="form">
            <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-global" onClick={SubmitRegister} disabled={loading}>
                {loading ? <div className="loader"></div> : "Register"}
            </button>
        </div>
    );
};

export default AuthPage;
