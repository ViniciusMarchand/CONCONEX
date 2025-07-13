import { Axios } from "./Axios";

const controllerBase = "api/send-notification";

const NotificationApi = {
    send: async (dto: {to:string, title:string, body:string}) => {
        const URL = controllerBase;
        return await Axios.post(URL, dto)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },
}

export default NotificationApi;