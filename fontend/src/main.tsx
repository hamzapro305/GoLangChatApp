import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./sass/global.scss";

createRoot(document.getElementById("root")!).render(<App />);
