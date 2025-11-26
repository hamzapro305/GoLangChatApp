import axios from "axios";

const BACKEND_DOMAIN: string = import.meta.env.VITE_BACKEND_DOMAIN || "localhost:3001";

console.log(BACKEND_DOMAIN)

const apiClient = axios.create({
    baseURL: `http://${BACKEND_DOMAIN}/api/v1`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
