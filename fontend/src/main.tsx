import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./sass/global.scss";
import StoreProvider from "./Redux/StoreProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <>
        <StoreProvider>
            <App />
        </StoreProvider>
    </>
);
