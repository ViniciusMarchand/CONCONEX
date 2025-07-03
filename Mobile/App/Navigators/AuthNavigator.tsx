import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreens } from "../Constants/Screens";
import { AuthStackParamList } from "../Types/NavigatorTypes";
import MainTabs from "./MainTabs";
import ProjectDetails from "../Screens/Auth/ProjectDetails";
import ProjectForm from "../Screens/Auth/ProjectForm";
import ProjectsProvider from "../Contexts/ProjectsContext";
import ProjectStageForm from "../Screens/Auth/ProjectStageForm";
import Messages from "../Screens/Auth/Messages";
import { SignalRProvider } from "../Contexts/SignalRContext";
import { useAuth } from "../Contexts/AuthContext";
import { usePushToken } from "../Hooks/usePushToken";
import GoogleAuthProvider from "../Contexts/GoogleAuthContext";
import CalendarConfigs from "../Components/Calendar/CalendarConfigs";


export default function AuthNavigator() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  const { 
    TabNavigator, 
    ProjectDetailsScreen, 
    ProjectFormScreen, ProjectStageFormScreen, 
    ChatScreen,
    CalendarConfigsScreen
  } = AuthScreens;
  const { user } = useAuth();

  if(!user) {
    return;
  }

  usePushToken(user.id);
  
  return (
    <GoogleAuthProvider>
      <SignalRProvider userId={user.id} >
        <ProjectsProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              presentation: 'transparentModal',

            }}
          >
            <Stack.Screen name={TabNavigator} component={MainTabs} />
            <Stack.Screen name={ProjectDetailsScreen} component={ProjectDetails} />
            <Stack.Screen name={ProjectFormScreen} component={ProjectForm} />
            <Stack.Screen name={ProjectStageFormScreen} component={ProjectStageForm} />
            <Stack.Screen name={ChatScreen} component={Messages} />
            <Stack.Screen name={CalendarConfigsScreen} component={CalendarConfigs} />
          </Stack.Navigator>
        </ProjectsProvider>
      </SignalRProvider>
    </GoogleAuthProvider>
  );
}
