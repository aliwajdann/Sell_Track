import axios from "axios";

const apiBaseURL =
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000/api";

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    timeout: 8000
});


export default api;
