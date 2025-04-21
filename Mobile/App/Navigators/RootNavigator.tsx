import { NavigationContainer } from "@react-navigation/native";
import NoAuthNavigator from "./NoAuthNavigator";

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <NoAuthNavigator/>
        </NavigationContainer>
    )
}