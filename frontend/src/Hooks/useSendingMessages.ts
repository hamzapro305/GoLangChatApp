import { ChatMessage } from "../@types/chat";
import useLocalStorage from "./useLocalStorage";

const useSendingMessages = () => {
    return useLocalStorage<ChatMessage[]>("sendingMessages", []);
};

export default useSendingMessages;
