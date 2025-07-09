import { NavigationContainer } from "@react-navigation/native";
import NoAuthNavigator from "./NoAuthNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../Contexts/AuthContext";


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