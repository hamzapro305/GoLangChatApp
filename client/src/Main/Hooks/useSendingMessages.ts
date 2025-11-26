import { ChatMessage } from "@/@types/chat.js";
import useLocalStorage from "./useLocalStorage.js";

const useSendingMessages = () => {
    return useLocalStorage<ChatMessage[]>("sendingMessages", []);
};

export default useSendingMessages;
