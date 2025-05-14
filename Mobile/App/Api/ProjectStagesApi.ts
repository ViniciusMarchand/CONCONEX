import { Axios } from "./Axios";

const controllerBase = "api/project-stage";

const projectStagesApi = {
    findByProjectId: async (id:string) => {
        const URL = controllerBase + "/project/" + id;
        return await Axios.get(URL)
        .then((res) => res)
        .catch(error => {
            throw error;
        })
    }
}

export default projectStagesApi;

