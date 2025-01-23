import AuthPage from "./pages/AuthPage";
import ChatProvider from "./pages/chat/ChatProvider";
import MainChat from "./pages/chat/MainChat";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
    return (
        <div className="">
            <Router>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                        path="/chat"
                        element={
                            <ChatProvider>
                                <MainChat />
                            </ChatProvider>
                        }
                    />
                    <Route path="/">Home</Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
