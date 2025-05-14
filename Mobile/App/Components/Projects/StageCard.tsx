import { ProjectStage } from "@/App/Types";
import { View } from "react-native";
import CardLayout from "../Common/CardLayout";
import Title from "../Common/Title";
import CustomText from "../Common/CustomText";
import { stringToStatus } from "@/App/Constants";
import { Image } from "expo-image";
import NoImage from "../../../Assets/img/no-image.png";
import { format } from "date-fns";
import AntDesign from '@expo/vector-icons/AntDesign';
import StatusBar from "../Common/StatusBar";
import useColors from "@/App/Hooks/useColors";
import CircularText from "../Common/CircularText";

interface Props {
    stage: ProjectStage
    index?: number
}
export default function StageCard({ stage, index }: Props) {
    const { title, description, deadline, order, status } = stage;
    const image = stage?.image;
    const { fontColor } = useColors();
    return (
        <CardLayout className="p-2 flex justify-between mb-4">
            <View className="px-3 pt-1 gap-2  flex-col justify-between">
                <View className="gap-2">
                    <View>
                        <CircularText number={index ? index : 0 }/>
                    </View>
                    <View>
                        <Title
                            className="text-justify">
                            {title}
                        </Title>
                        <CustomText
                            className="text-justify"
                        >
                            {description}
                        </CustomText>
                    </View>
                </View>
                <View className="gap-3">
                    <StatusBar status={stringToStatus(status)} />
                    <View className="flex-row items-center gap-2">
                        <AntDesign name="calendar" size={24} color={fontColor} />
                        <CustomText>Data da Entrega: {format(new Date(deadline), "dd/MM/yyyy")}</CustomText>
                    </View>
                </View>
            </View>
        </CardLayout>
    )
}