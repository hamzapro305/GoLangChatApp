import { useEffect, useState } from "react";
import "./style.scss";
import { Auth } from "../../utils/Auth";
import { useNavigate } from "react-router-dom";
import useToken from "../../Hooks/useToken";
import UserService from "../../utils/UserService";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useToken();
    const navigate = useNavigate();

    const VerifyToken = async (_token: string) => {
        try {
            await UserService.GetCurrentUser(_token);
            navigate({
                pathname: "/chat",
            });
        } catch (error) {}
    };
    useEffect(() => {
        if (token) VerifyToken(token);
    }, [token]);

    const SubmitLogin = async () => {
        try {
            const data = await Auth.Login(email, password);
            setToken(data.token);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-page-wrapper">
                <div className="title">Chat App</div>
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
                <button className="btn-global" onClick={SubmitLogin}>submit</button>
            </div>
        </div>
    );
};

export default AuthPage;
