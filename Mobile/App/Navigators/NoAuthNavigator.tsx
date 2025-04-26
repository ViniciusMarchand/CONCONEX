import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "App/Screens/NoAuth/Layout";
import Login from "App/Screens/NoAuth/Login";
import { NoAuthScreens } from "../Constants/Screens";

export default function NoAuthNavigator() {
  const Stack = createNativeStackNavigator();  
  const { LoginScreen, SignUpScreen } = NoAuthScreens;
  
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenLayout={({ children }) => (
          <Layout>
            {children}
          </Layout>
        )}
      >
        <Stack.Screen name={LoginScreen} component={Login} />
      </Stack.Navigator>
  );
}