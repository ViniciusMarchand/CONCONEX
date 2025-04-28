import { apiUrl } from "../Constants/Env";
import axios from "axios";

export const AxiosNoAuth = axios.create({
    baseURL: apiUrl,
});
