import axios from "axios";
import { LoginFormValues, RegistrationFormValues } from "../Types";
import { Axios, AxiosNoAuth } from "./Axios";

const authApi = {
    login: async (user: LoginFormValues) => {
        const URL = "api/auth/login";
        return await AxiosNoAuth.post(URL, user)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },
    

    register: async (newUser: RegistrationFormValues) => {
        const URL = "api/auth/register";
        return await AxiosNoAuth.post(URL, newUser)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    resendEmail: async (email: string) => {
        const URL = "api/auth/resend-verification-code/" + email;
        return await AxiosNoAuth.get(URL)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    confirmEmail: async (email: string, code: string) => {
        const URL = "api/auth/validate-user";
        return await AxiosNoAuth.post(URL, { email, code })
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    userInfo: async () => {
        const URL = "api/auth/user-info";
        return await Axios.get(URL)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    exchangeGoogleToken: async (serverAuthCode: string, clientId: string, clientSecret: string, redirectUri?: string) => {
        const tokenEndpoint = 'https://oauth2.googleapis.com/token';
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', serverAuthCode);
        if (redirectUri !== undefined) {
            params.append('redirect_uri', redirectUri);
        }

        try {
            const response = await axios.post(tokenEndpoint, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            return response.data;

        } catch (error: any) {
            console.error('Erro ao trocar token do Google:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

}

export default authApi;

