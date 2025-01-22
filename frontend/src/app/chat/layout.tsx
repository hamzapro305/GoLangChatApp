"use client";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { useAppDispatch } from "@/Redux/Hooks";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars";
import GetLayout from "@/utils/GetLayout";
import { WebSocketInComingMessageHanlder } from "@/utils/WebScoketMessageHandler";
import { useEffect } from "react";

const layout = GetLayout<"children">(({ children }) => {
    const dispatch = useAppDispatch();
    const [token, _] = useLocalStorage<string | null>("token", null);
    useEffect(() => {
        if (token) {
            const ws = new WebSocket(
                `ws://localhost:3001/api/v1/ws/conversation?token=${token}`
            );
            dispatch(GlobalVarsActions.setWebsocket(ws));

            // Handle incoming messages
            ws.onmessage = (event) => {
                const receivedData = JSON.parse(event.data);
                WebSocketInComingMessageHanlder.BasicMessageHandler(
                    receivedData,
                    dispatch
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
    }, [token]);

    return children;
});

export default layout;
