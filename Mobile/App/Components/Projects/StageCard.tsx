import { ProjectStage } from "@/App/Types";
import { TouchableOpacity, View } from "react-native";
import CardLayout from "../Common/CardLayout";
import Title from "../Common/Title";
import CustomText from "../Common/CustomText";
import { stringToStatus } from "@/App/Constants";
import { format } from "date-fns";
import AntDesign from '@expo/vector-icons/AntDesign';
import StatusBar from "../Common/StatusBar";
import useColors from "@/App/Hooks/useColors";
import CircularText from "../Common/CircularText";
import { Feather } from "@expo/vector-icons";
import RemoveProjectStageModal from "./RemoveProjectStageModal";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthScreens } from "@/App/Constants/Screens";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CarouselStage from "./CarouselStage";
import { useRef, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import projectStagesApi from "@/App/Api/ProjectStagesApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import RemoveProjectStageImageModal from "./RemoveProjectStageImageModal";

interface Props {
    stage: ProjectStage
    index?: number,
    refresh: Function,
    isAuth: boolean,
}
export default function StageCard({ stage, index, refresh, isAuth }: Props) {
    const { id, title, description, deadline, status, images, projectId } = stage;
    const [focusedImageIndex, setFocusedImageIndex] = useState(0);

    const { fontColor } = useColors();
    const { navigate } = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { ProjectStageFormScreen } = AuthScreens;

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            selectionLimit: 1
        });

        if (result.canceled) {
            return;
        }

        const image = result.assets[0];
        const formData = new FormData();

        formData.append('projectStageId', id !== undefined && id !== null ? id.toString() : "");

        formData.append('image', {
            uri: image.uri,
            name: image.fileName || `upload_${Date.now()}${image.uri.split('.').pop() || '.jpg'}`,
            type: image.mimeType || 'image/jpeg',
        } as any);

        try {
            await projectStagesApi.addIamge(formData);
            successToast("Imagem adicionada com sucesso.");
            await refresh();
        } catch (error: any) {
            errorToast("Erro ao adicionar imagem.");
            console.error(error.response?.data)
        }
    };

    return (
        <CardLayout className="p-2 flex justify-between mb-4">
            <View className="px-3 pt-1 gap-2  flex-col justify-between">
                <View className="gap-2">
                    <View className="flex-row justify-between">
                        <CircularText number={index ? index : 0} />
                        <View className="flex-row gap-2">
                            {
                                isAuth && <>
                                    <TouchableOpacity onPress={() => pickImageAsync()}>
                                        <MaterialCommunityIcons name="image-plus" size={24} color={fontColor} />
                                    </TouchableOpacity>
                                    <RemoveProjectStageImageModal refresh={refresh} id={images[focusedImageIndex]?.id} setIndexRef={setFocusedImageIndex}/>

                                    <TouchableOpacity onPress={() => navigate(ProjectStageFormScreen, stage)}>
                                        <Feather name="edit" size={24} color={fontColor} />
                                    </TouchableOpacity>
                                    <RemoveProjectStageModal stage={stage} refresh={refresh} />
                                </>
                            }
                        </View>
                    </View>
                    <View>
                        <Title
                            className="text-start">
                            {title}
                        </Title>
                        {
                            images.length > 0 &&
                            <CarouselStage images={images} indexRef={focusedImageIndex} setIndexRef={setFocusedImageIndex}/>
                        }
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