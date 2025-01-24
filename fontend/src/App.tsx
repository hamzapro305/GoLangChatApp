import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./pages/AuthPage";
import ChatProvider from "./pages/chat/ChatProvider";
import MainChat from "./pages/chat/MainChat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
    return (
        <div className="">
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route
                            path="/chat"
                            element={
                                <ChatProvider>
                                    <MainChat />
                                </ChatProvider>
                            }
                        />
                    </Routes>
                </Router>
            </QueryClientProvider>
        </div>
    );
};

export default App;
