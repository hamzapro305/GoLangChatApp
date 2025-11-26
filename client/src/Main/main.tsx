import "./sass/global.scss";
import StoreProvider from "./Redux/StoreProvider.js";
import App from "./App.js";
import { createRoot } from 'react-dom/client';



createRoot(document.getElementById("root")!).render(
    <>
        <StoreProvider>
            <App />
        </StoreProvider>
    </>
);
