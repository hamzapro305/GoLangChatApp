import { useAppSelector } from "@/Redux/Hooks.js";
import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";

type PrivateRouteT = FC<{ children: React.ReactNode }>;
const PrivateRoute: PrivateRouteT = ({ children }) => {

    const location = useLocation();
    const { isLogin } = useAppSelector((s) => s.GlobalVars);
    if (!isLogin) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Access Denied</h2>
                <p>Your session has expired or you are not logged in.</p>
                <Link to="/" state={{ from: location }}>
                    <button
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Go to Login Page
                    </button>
                </Link>
            </div>
        );
    }

    return children;
};

export default PrivateRoute;
