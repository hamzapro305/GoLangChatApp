import axios from "axios";

const apiClient = new axios.Axios({
    baseURL: "http://localhost:3001/api/v1",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
});

export default apiClient;
