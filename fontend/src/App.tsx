import ChatProvider from "./pages/chat/ChatProvider";
import MainChat from "./pages/chat/MainChat";

const App = () => {
    return (
        <div className="">
            <ChatProvider>
                <MainChat />
            </ChatProvider>
        </div>
    );
};

export default App;
