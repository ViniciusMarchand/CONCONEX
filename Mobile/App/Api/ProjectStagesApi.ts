import { ProjectStageRequestDTO } from "../Types";
import { Axios } from "./Axios";

const controllerBase = "api/project-stage";

const projectStagesApi = {
    save: async (form: ProjectStageRequestDTO) => {
        const URL = controllerBase;
        return await Axios.post(URL, form)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    update: async (form: ProjectStageRequestDTO, id: string) => {
        const URL = controllerBase + "/" + id;
        return await Axios.put(URL, form)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    },

    findByProjectId: async (id:string) => {
        const URL = controllerBase + "/project/" + id;
        return await Axios.get(URL)
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
    },

    addIamge: async (formData:FormData) => {
        const URL = controllerBase + "/image";
        return await Axios.post(URL, formData,  {
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

    removeImage: async (id:string) => {
        const URL = controllerBase + "/image/" + id;
        return await Axios.delete(URL) 
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    }
}

export default projectStagesApi;

