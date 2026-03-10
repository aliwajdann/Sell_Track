import axios from "axios";

const api = axios.create({
    baseURL: "https://selltrack.onrender.com/api",
    withCredentials: true
});


export default api;