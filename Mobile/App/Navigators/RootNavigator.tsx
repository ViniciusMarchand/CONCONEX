import { NavigationContainer } from "@react-navigation/native";
import NoAuthNavigator from "./NoAuthNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../Contexts/AuthContext";
import { logoutAsync } from "../Utils/SecureStore";
import MainTabs from "./MainTabs";

export default function RootNavigator() {

    const { user } = useAuth();
    
    return (
        <>
            <NavigationContainer>
                {
                    user 
                    ? <AuthNavigator/> 
                    : <NoAuthNavigator/>
                }
            </NavigationContainer>
        </>
    )
}