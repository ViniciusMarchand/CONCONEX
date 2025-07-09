import Calendar from "../Screens/Auth/Calendar";
import Chats from "../Screens/Auth/Chats";
import Profile from "../Screens/Auth/Profile";
import Projects from "../Screens/Auth/Projects";

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