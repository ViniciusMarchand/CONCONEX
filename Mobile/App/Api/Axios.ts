import { apiUrl } from "../Constants/Env";
import axios from "axios";
import { getAccessToken, getGoogleAccessToken } from "../Utils/SecureStore";

export const AxiosNoAuth = axios.create({
    baseURL: apiUrl,
});

export const AxiosGoogle = axios.create();


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

AxiosGoogle.interceptors.request.use(
     async (config) => {
        const token = await getGoogleAccessToken(); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

