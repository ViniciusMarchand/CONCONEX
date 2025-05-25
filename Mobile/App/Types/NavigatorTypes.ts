import { ProjectResponseDTO, ProjectStage, Chat as ChatType } from ".";

export type NoAuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    EmailVerification: { email: string } | undefined;
};

export type AuthStackParamList = {
    Home: undefined;
    TabNavigator: undefined;
    ProjectDetails: ProjectResponseDTO;
    ProjectForm: undefined | ProjectResponseDTO;
    ProjectStageForm: undefined | ProjectStage;
    Chat: ChatType;
};

export type AsyncState<T> = {
  data: T | null; 
  loading: boolean;  
  error: Error | null;
  execute?:Function;
};