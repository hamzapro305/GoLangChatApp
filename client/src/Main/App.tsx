import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthChecker from "./components/AuthChecker.js";
import PrivateRoute from "./components/PrivateRoute.js";
import ChatProvider from "./pages/chat/ChatProvider.js";
import HSToast from "./components/HSToast.js";
import ModalsInit from "./modals/ModalsInit.js";
import AuthPage from "./pages/AuthPage/index.js";

const queryClient = new QueryClient({
    queryCache: new QueryCache({}),
});

const App = () => {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <AuthChecker>
                    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
