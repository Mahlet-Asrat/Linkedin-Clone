import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.DEV ? 'http://localhost:4000/api/v1' : '/api/v1',
    withCredentials: true,
})