import { useEffect, useState } from "react";
import "./style.scss";
import { Auth } from "../../utils/Auth";
import { useNavigate } from "react-router-dom";
import useToken from "../../Hooks/useToken";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useToken();
    const navigate = useNavigate();
    const VerifyToken = () => {
        // navigate({
        //     pathname: "/chat",
        // });
    };
    useEffect(() => {
        if (token) VerifyToken();
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
            <button onClick={SubmitLogin}>submit</button>
        </div>
    );
};

export default AuthPage;
