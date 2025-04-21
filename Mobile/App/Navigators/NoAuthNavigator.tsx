import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "App/Screens/NoAuth/Layout";
import Login from "App/Screens/NoAuth/Login";
import { View } from "react-native";

export default function NoAuthNavigator() {
  const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenLayout={({ children }) => (
          <Layout>
            {children}
          </Layout>
        )}
      >
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
  );
}