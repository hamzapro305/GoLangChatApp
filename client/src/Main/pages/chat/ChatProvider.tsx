import { FC, useEffect } from "react";
import MainChat from "./MainChat.js";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks.js";
import useLocalStorage from "@/Hooks/useLocalStorage.js";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars.js";
import { WebSocketInComingMessageHanlder } from "@/utils/WebScoketMessageHandler.js";
import UserService from "@/utils/UserService.js";

const ChatProvider: FC<{}> = () => {
    const dispatch = useAppDispatch();
    const [token, _] = useLocalStorage<string | null>("token", null);
    const chat = useAppSelector((s) => s.Chat);
    const user = useAppSelector((s) => s.GlobalVars.user);

    useEffect(() => {
        if (token && user) {
            const ws = new WebSocket(
                `ws://localhost:3001/api/v1/ws/conversation?token=${token}`
            );
            dispatch(GlobalVarsActions.setWebsocket(ws));

            // Handle incoming messages
            ws.onmessage = (event) => {
                const receivedData = JSON.parse(event.data);
                WebSocketInComingMessageHanlder.BasicMessageHandler(
                    receivedData,
                    dispatch,
                    {
                        user: user,
                        chat: chat,
                    }
                );
            };

            // Handle WebSocket close
            ws.onclose = () => {
                console.log("WebSocket Disconnected");
            };

            // Cleanup on component unmount
            return () => {
                ws.close();
            };
        }
    }, [token, user?.id]);
    
    useEffect(() => {
        if (token) {
            const FetchUser = async () => {
                const user = await UserService.GetCurrentUser(token);
                dispatch(GlobalVarsActions.setUser(user));
            };
            FetchUser();
        }
    }, [token]);
    return <MainChat />;
};

export default ChatProvider;
