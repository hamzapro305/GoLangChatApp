import useToken from "@/Hooks/useToken.js";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars.js";
import UserService from "@/utils/UserService.js";
import React, { FC, useEffect } from "react";

import GlobalLoading from "./GlobalLoading.js";

type AuthCheckerT = FC<{ children: React.ReactNode }>;
const AuthChecker: AuthCheckerT = ({ children }) => {
    const [token] = useToken();
    const { isLoading } = useAppSelector((s) => s.GlobalVars);
    const dispatch = useAppDispatch();

    const VerifyToken = async (_token: string) => {
        try {
            await UserService.GetCurrentUser(_token);
            dispatch(GlobalVarsActions.setIsLoading(false));
            dispatch(GlobalVarsActions.setIsLogin(true));
        } catch (error) {
            console.log(error);
            dispatch(GlobalVarsActions.setIsLoading(false));
            dispatch(GlobalVarsActions.setIsLogin(false));
        }
    };

    useEffect(() => {
        if (token) {
            // Verify token
            VerifyToken(token);
        } else {
            dispatch(GlobalVarsActions.setIsLoading(false));
            dispatch(GlobalVarsActions.setIsLogin(false));
        }
    }, [token]);

    if (isLoading) return <GlobalLoading />;

    return children;
};

export default AuthChecker;
