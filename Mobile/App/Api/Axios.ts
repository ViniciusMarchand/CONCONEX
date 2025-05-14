import { apiUrl } from "../Constants/Env";
import axios from "axios";
import { getAccessToken } from "../Utils/SecureStore";

export const AxiosNoAuth = axios.create({
    baseURL: apiUrl,
});

export const Axios = axios.create({
    baseURL: apiUrl,
});

Axios.interceptors.request.use(
     (config) => {
        const token = getAccessToken(); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
