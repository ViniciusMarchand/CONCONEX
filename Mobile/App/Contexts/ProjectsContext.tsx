import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { ProjectResponseDTO } from "../Types";
import { contextError } from "../Constants/Errors";
import projectApi from "../Api/ProjectApi";
import { errorToast } from "../Utils/Toasts";
import { translateError } from "../Utils/ErrorTranslations";

interface Props {
    children: ReactNode
}

const ProjectsContext = createContext<{
    myProjects: ProjectResponseDTO[];
    findProjects: Function;
}>({
    myProjects: [],
    findProjects: async () => {}
});

export default function ProjectsProvider({children} : Props) {
    const { findProjectsAsAdmin } = projectApi;
    
    const [myProjects, setMyprojects] = useState([]);
    
    const findProjects = useCallback(async () => {
        try {
            const res:any = await findProjectsAsAdmin();
            setMyprojects(res.data);
        } catch (error:any) {
            errorToast(translateError(error?.response?.data));
        }
    },[]);


    useEffect(() => {
        findProjects()
    },[])
    
    return <ProjectsContext.Provider value={{ myProjects, findProjects }}>
        {children}
    </ProjectsContext.Provider>
}

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    
    if (!context) {
      contextError("projectsContext");
    }

    return context;
  };