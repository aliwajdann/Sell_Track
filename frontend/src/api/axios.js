import axios from "axios";

const api = axios.create({
    baseURL: process.env.baseURL,
    withCredentials: true
});

export default api;