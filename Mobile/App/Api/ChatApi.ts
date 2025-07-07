import { AddUserRequest, Message, MessageDTO, ProjectRequestDTO } from "../Types";
import { Axios } from "./Axios";

const controllerBase = "api/message";

const chatApi = {
    
    findChats: async () => {
        const URL = controllerBase + "/chats";
        return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    findMessages: async (projectId:string, page:number, limit:number) => {
        const URL = controllerBase + "/project/" + projectId + `?page=${page}&limit=${limit}`;
        return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    sendMessage: async (message : FormData | MessageDTO) => {
        const URL = controllerBase;
        return await Axios.post(URL, message, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    readMessages: async (projectId:string) => {
        const URL = controllerBase + "/read/" + projectId;
            return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    }


}


export default chatApi;

