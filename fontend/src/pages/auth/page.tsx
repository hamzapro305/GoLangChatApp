import { useState } from "react";
import "./style.scss";
import useLocalStorage from "../../Hooks/useLocalStorage";
import { Auth } from "../../utils/Auth";

const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setToken] = useLocalStorage<string | null>("token", null);
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

export default page;
