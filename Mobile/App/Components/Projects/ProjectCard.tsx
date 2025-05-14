import { View } from "react-native";
import CardLayout from "../Common/CardLayout";
import { ProjectResponseDTO } from "@/App/Types";
import CustomText from "../Common/CustomText";
import { Image } from "expo-image";
import Title from "../Common/Title";
import NoImage from "../../../Assets/img/no-image.png";
import StatusBar from "../Common/StatusBar";
import { stringToStatus } from "@/App/Constants";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";
import { format } from "date-fns";

interface Props {
    project: ProjectResponseDTO
}

export default function ProjectCard({ project }: Props) {

    const { id , title, description, status: StatusString, deadline, adminName } = project;
    const image = project?.image;
    const status = stringToStatus(StatusString);
    const { fontColor } = useColors();

    return (
        <CardLayout className="p-2 flex justify-between mb-4">
            <View className="w-full h-56 flex justify-center items-center border border-tertiary dark:border-tertiary-dark rounded-[10px]">
                <Image
                    source={!image ? NoImage : image}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    contentFit="contain"
                />
            </View>
            <View className="px-3 pt-6 gap-2 h-64 flex-col justify-between">
                <View >
                    <Title
                        className="text-justify leading-7"
                        numberOfLines={2}>
                        {title}
                    </Title>
                    <CustomText
                        className="text-justify leading-6 text-base"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {description}
                    </CustomText>

                </View>
                <View className="gap-3">
                        <StatusBar status={status} />
                        <View className="flex-row  items-center flex-wrap max-w-full">
                            {
                                adminName.firstName ? <>
                                <AntDesign name="user" size={24} color={fontColor} />
                                <CustomText
                                    className="text-justify leading-6 text-base"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >{`${adminName.firstName} ${adminName.lastName}`}</CustomText>
                                </>
                                : <CustomText className="text-sm">Sem usuários cadastrados no projeto</CustomText>
                            }
                        </View>
                    <View className="flex-row items-center gap-2">
                        <AntDesign name="calendar" size={24} color={fontColor} />
                        <CustomText>Data da Entrega: {format(new Date(deadline), "dd/MM/yyyy")}</CustomText>
                    </View>
                </View>
            </View>

        </CardLayout>
    )
}