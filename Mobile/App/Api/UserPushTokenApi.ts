import { Axios } from "./Axios";

const controllerBase = "api/user-push-token";

const userPushTokenApi = {
    save: async (dto: {userId:string, token:string}) => {
        const URL = controllerBase;
        return await Axios.post(URL, dto)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },
}

export default userPushTokenApi;