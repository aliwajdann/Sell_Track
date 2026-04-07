import axios from "axios";

const fallbackApiBaseURL = "http://localhost:3000/api";
const apiBaseURL = import.meta.env.VITE_API_BASE_URL?.trim() || fallbackApiBaseURL;

if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL) {
    console.warn("VITE_API_BASE_URL is not set. Frontend will call localhost and auth will fail in production.");
}

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    timeout: 8000
});

export default api;