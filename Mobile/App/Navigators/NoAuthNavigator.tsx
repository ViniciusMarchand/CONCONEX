import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "App/Screens/NoAuth/Layout";
import Login from "App/Screens/NoAuth/Login";
import { NoAuthScreens } from "../Constants/Screens";
import SignUp from "../Screens/NoAuth/SignUp";
import { NoAuthStackParamList } from "../Types/NavigatorTypes";
import EmailVerification from "../Screens/NoAuth/EmailVerification";


export default function NoAuthNavigator() {
  const Stack = createNativeStackNavigator<NoAuthStackParamList>();
  const { LoginScreen, SignUpScreen, EmailVerificationScreen } = NoAuthScreens;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',

      }}

      screenLayout={({ children }) => (
        <Layout>
          {children}
        </Layout>
      )}
    >
      <Stack.Screen name={LoginScreen} component={Login} />
      <Stack.Screen name={SignUpScreen} component={SignUp} />
      <Stack.Screen name={EmailVerificationScreen} component={EmailVerification} />
    </Stack.Navigator>
  );
}
