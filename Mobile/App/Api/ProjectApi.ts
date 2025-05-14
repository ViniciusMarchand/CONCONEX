import { ProjectRequestDTO } from "../Types";
import { Axios } from "./Axios";

const controllerBase = "api/project";

const projectApi = {

    save: async (form: ProjectRequestDTO) => {
        console.warn("FOI")
        const URL = controllerBase;
        return await Axios.post(URL, form)
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
    }
}


export default projectApi;

