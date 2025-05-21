import projectApi from "@/App/Api/ProjectApi";
import { FlatList, Pressable, View } from "react-native";
import ProjectCard from "./ProjectCard";
import { useApiCall } from "@/App/Hooks/useApiCall";
import { useNavigation } from "@react-navigation/native";
import { AuthScreens } from "@/App/Constants/Screens";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import CustomText from "../Common/CustomText";

export default function HiredProjects() {

    const { findProjectsAsClient } = projectApi;
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { ProjectDetailsScreen } = AuthScreens;
    const { loading, error, data } = useApiCall(findProjectsAsClient);
    return (
        data &&
        (
            data.length > 0 ?
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
            : <View className="flex-1 w-full h-full justify-center items-center">
                <CustomText className="text-gray-400 dark:text-gray-400">Você ainda não foi incluído em nenhum projeto.</CustomText>
            </View> 
        )

    )
}