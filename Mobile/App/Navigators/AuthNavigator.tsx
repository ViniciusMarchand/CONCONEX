import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "App/Screens/NoAuth/Layout";
import { AuthScreens } from "../Constants/Screens";
import { AuthStackParamList } from "../Types/NavigatorTypes";
import MainTabs from "./MainTabs";
import ProjectDetails from "../Screens/Auth/ProjectDetails";
import ProjectForm from "../Screens/Auth/ProjectForm";
import ProjectsProvider from "../Contexts/ProjectsContext";
import ProjectStageForm from "../Screens/Auth/ProjectStageForm";


export default function AuthNavigator() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  const { TabNavigator, ProjectDetailsScreen, ProjectFormScreen, ProjectStageFormScreen } = AuthScreens;

  return (
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
      </Stack.Navigator>
    </ProjectsProvider>
  );
}
