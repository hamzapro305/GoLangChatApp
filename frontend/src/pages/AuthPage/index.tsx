import { FC, useEffect, useState } from "react";
import "./style.scss";
import { Auth } from "../../utils/Auth";
import { useNavigate } from "react-router-dom";
import useToken from "../../Hooks/useToken";
import UserService from "../../utils/UserService";
import { Toast } from "@/components/HSToast";
import { useAppDispatch } from "@/Redux/Hooks";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars";

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
                {isLogin ? (
                    <LoginForm setToken={setToken} />
                ) : (
                    <RegisterForm setToken={setToken} />
                )}
                <button
                    className="change"
                    onClick={() => setIsLogin((p) => !p)}
                >
                    {isLogin ? "don't have account?" : "already have account?"}
                </button>
            </div>
        </div>
    );
};

type SetTokenT = FC<{ setToken: (token: string) => void }>;
const LoginForm: SetTokenT = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const SubmitLogin = async () => {
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
        }
    };
    return (
        <div className="form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-global" onClick={SubmitLogin}>
                Login
            </button>
        </div>
    );
};
const RegisterForm: SetTokenT = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const SubmitRegister = async () => {
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
        }
    };
    return (
        <div className="form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="UserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-global" onClick={SubmitRegister}>
                Register
            </button>
        </div>
    );
};

export default AuthPage;
