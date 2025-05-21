import { AuthScreens } from "@/App/Constants/Screens";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Pressable, View } from "react-native";
import ProjectCard from "./ProjectCard";
import CircularPlusButton from "../Common/CircularPlusButton";
import CustomText from "../Common/CustomText";
import { useProjects } from "@/App/Contexts/ProjectsContext";

export default function MyServices() {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { ProjectDetailsScreen, ProjectFormScreen } = AuthScreens;
    const { myProjects } = useProjects();

    return (
        myProjects &&
        <>
            {
                myProjects.length ?
                    <FlatList
                        className="mt-5"
                        data={myProjects}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => navigation.navigate(ProjectDetailsScreen, item)}>
                                <ProjectCard project={item} />
                            </Pressable>
                        )}
                        numColumns={1}
                        keyExtractor={(item) => item.id}
                    />
                    : <View className="flex-1 w-full h-full justify-center items-center">
                        <CustomText className="text-gray-400 dark:text-gray-400">Você ainda não criou nenhum projeto.</CustomText>
                    </View>
            }
            <CircularPlusButton onPress={() => navigation.navigate(ProjectFormScreen)} />
        </>

    )
}