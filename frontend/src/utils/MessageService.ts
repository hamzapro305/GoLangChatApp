import { ChatMessage } from "../@types/chat";
import apiClient from "./Axios";

const FetchMessages = (token: string, conv: string): Promise<ChatMessage[]> => {
    const body = JSON.stringify({
        conversationId: conv,
    });
    return new Promise(async (res, rej) => {
        try {
            const response = await apiClient.post("/message/get", body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            res(response.data?.messages as ChatMessage[]);
        } catch (error) {
            console.log(error);
            rej(null);
        }
    });
};

const MessageService = {
    FetchMessages,
};

export default MessageService;
