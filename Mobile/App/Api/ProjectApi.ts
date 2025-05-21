import { AddUserRequest, ProjectRequestDTO } from "../Types";
import { Axios } from "./Axios";

const controllerBase = "api/project";

const projectApi = {

    save: async (form: FormData) => {
        const URL = controllerBase;
        return await Axios.post(URL, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            }
        })
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    update: async (form: FormData, id: string) => {
        const URL = controllerBase + "/" + id;
        return await Axios.put(URL, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            }
        })
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    findProjectsAsClient: async () => {
        const URL = controllerBase + "/user";
        return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },
    
    findProjectsAsAdmin: async () => {
        const URL = controllerBase + "/admin";
        return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    addUser: async (values:AddUserRequest) => {
        const URL = controllerBase + "/add-user";
        return await Axios.post(URL, values)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    remove: async (projectId: string) => {
        const URL = controllerBase + "/" + projectId;
        return await Axios.delete(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    }
}


export default projectApi;

