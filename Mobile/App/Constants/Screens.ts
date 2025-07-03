import Calendar from "../Screens/Auth/Calendar";
import Chats from "../Screens/Auth/Chats";
import Profile from "../Screens/Auth/Profile";
import Projects from "../Screens/Auth/Projects";

export const NoAuthScreens = {
    LoginScreen: "Login",
    SignUpScreen: "SignUp",
    EmailVerificationScreen: "EmailVerification",
} as const;
  
export const AuthScreens = {
    HomeScreen: "Home",
    TabNavigator: "TabNavigator",
    ProjectDetailsScreen: "ProjectDetails",
    ProjectsScreen:"Projetos",
    ProjectFormScreen:"ProjectForm",
    ProjectStageFormScreen:"ProjectStageForm",
    ChatScreen:"Chat",
    CalendarConfigsScreen:"CalendarConfig",
} as const;

export const MainTabsList = [
    {
        name: 'Agenda',
        component: Calendar,
        icon: 'calendar'
    },
        {
        name: 'Mensagens',
        component: Chats,
        icon: 'chatbubbles'
    },
        {
        name: 'Projetos',
        component: Projects,
        icon: 'documents'
    },
        {
        name: 'Perfil',
        component: Profile,
        icon: 'person-circle'
    },
] as const;