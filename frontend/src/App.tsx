import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import AuthPage from "./pages/AuthPage";
import ChatProvider from "./pages/chat/ChatProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModalsInit from "./modals/ModalsInit";
import HSToast from "./components/HSToast";
import PrivateRoute from "./components/PrivateRoute";
import AuthChecker from "./components/AuthChecker";

const queryClient = new QueryClient({
    queryCache: new QueryCache({}),
});

const App = () => {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <AuthChecker>
                    <Router>
                        <Routes>
                            <Route path="/" element={<AuthPage />} />
                            <Route
                                path="/chat"
                                element={
                                    <PrivateRoute>
                                        <ChatProvider />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </AuthChecker>
                <HSToast />
                <ModalsInit />
            </QueryClientProvider>
        </div>
    );
};

export default App;
