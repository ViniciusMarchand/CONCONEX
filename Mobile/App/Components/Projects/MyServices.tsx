import projectApi from "@/App/Api/ProjectApi";
import { AuthScreens } from "@/App/Constants/Screens";
import { useApiCall } from "@/App/Hooks/useApiCall";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Pressable, Text } from "react-native";
import ProjectCard from "./ProjectCard";
import CircularPlusButton from "../Common/CircularPlusButton";

export default function MyServices() {
    const { findProjectsAsAdmin } = projectApi;
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { ProjectDetailsScreen, ProjectFormScreen } = AuthScreens;
    const { loading, error, data } = useApiCall(findProjectsAsAdmin);

    return (
        data &&
        <>
            <FlatList
                className="mt-5"
                data={data}
                renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate(ProjectDetailsScreen, item)}>
                        <ProjectCard project={item} />
                    </Pressable>
                )}
                numColumns={1}
                keyExtractor={(item) => item.id}
            />
            <CircularPlusButton onPress={() => navigation.navigate(ProjectFormScreen)} />
        </>

    )
}