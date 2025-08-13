import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? 'http://localhost:4000/api/v1' : "/api/",
    withCredentials: true,
})