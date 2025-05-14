import MyServices from "@/App/Components/Projects/MyServices";
import { ProjectsTabOptions } from "@/App/Constants";
import { useState } from "react"
import { View } from "react-native";
import Layout from "../NoAuth/Layout";
import CardLayout from "@/App/Components/Common/CardLayout";
import TabButton from "@/App/Components/Projects/TabButton";
import HiredProjects from "@/App/Components/Projects/HiredProjects";
import { useNavigation } from "@react-navigation/native";

export default function Projects() {

    const [tabSelected, setTabSelected] = useState<ProjectsTabOptions>(ProjectsTabOptions.HiredProjects);

    return (
        <Layout>
            <View className="flex-1 mt-5 w-full h-[200px]">
                <CardLayout className="mt-5 h-16 flex-row p-3">
                    <TabButton 
                        name="Contratados" 
                        setTabSelected={setTabSelected}
                        value={ProjectsTabOptions.HiredProjects}
                        tabSelected={tabSelected}
                    />
                    <TabButton 
                        name="Meus Serviços" 
                        setTabSelected={setTabSelected}
                        value={ProjectsTabOptions.MyServices}
                        tabSelected={tabSelected}
                    />
                </CardLayout>
                {
                    tabSelected === ProjectsTabOptions.HiredProjects &&
                    <HiredProjects />
                }
                {
                    tabSelected === ProjectsTabOptions.MyServices &&
                    <MyServices />
                }
            </View>
        </Layout>
    )
}