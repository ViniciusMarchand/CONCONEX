import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "App/Screens/NoAuth/Layout";
import { AuthScreens } from "../Constants/Screens";
import { AuthStackParamList } from "../Types/NavigatorTypes";
import MainTabs from "./MainTabs";
import ProjectDetails from "../Screens/Auth/ProjectDetails";
import ProjectForm from "../Screens/Auth/ProjectForm";


export default function AuthNavigator() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  const { TabNavigator, ProjectDetailsScreen, ProjectFormScreen  } = AuthScreens;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',

      }}
    >
      <Stack.Screen name={TabNavigator} component={MainTabs} />
      <Stack.Screen name={ProjectDetailsScreen} component={ProjectDetails} />
      <Stack.Screen name={ProjectFormScreen} component={ProjectForm} />
    </Stack.Navigator>
  );
}
