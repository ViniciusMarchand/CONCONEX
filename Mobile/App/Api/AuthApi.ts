import { LoginFormValues, RegistrationFormValues } from "../Types";
import { AxiosNoAuth } from "./Axios";

const authApi = {
    login: async (user:LoginFormValues) => {
        const URL = "api/auth/login";
        return await AxiosNoAuth.post(URL, user)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    register: async (newUser:RegistrationFormValues) => {
        const URL = "api/auth/register";
        return await AxiosNoAuth.post(URL, newUser)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    resendEmail: async (email:string) => {
        const URL = "api/auth/resend-verification-code/" + email;
        return await AxiosNoAuth.get(URL)
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

    confirmEmail: async (email:string, code: string) => {
        const URL = "api/auth/validate-user";
        return await AxiosNoAuth.post(URL, {email, code})
            .then((res) => res)
            .catch(error => {
                throw error;
            })
    },

}

export default authApi;

