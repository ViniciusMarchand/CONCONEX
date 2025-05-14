import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Button, FlatList, Pressable, View } from "react-native";
import Layout from "../NoAuth/Layout";
import CustomText from "@/App/Components/Common/CustomText";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthScreens } from "@/App/Constants/Screens";
import Title from "@/App/Components/Common/Title";
import { useApiCall } from "@/App/Hooks/useApiCall";
import projectStagesApi from "@/App/Api/ProjectStagesApi";
import StatusBar from "@/App/Components/Common/StatusBar";
import { stringToStatus } from "@/App/Constants";
import { format } from "date-fns";
import StageCard from "@/App/Components/Projects/StageCard";

type ProjectDetailsRouteProp = RouteProp<
  AuthStackParamList,
  'ProjectDetails'
>;

interface Props {
  route: ProjectDetailsRouteProp;
}

export default function ProjectDetails({ route }: Props) {

  const { fontColor } = useColors();
  const { goBack } = useNavigation();

  const { adminName, deadline, description, id, status, title } = route.params;

  const { loading, error, data } = useApiCall(async () => await projectStagesApi.findByProjectId(id));

  console.warn(data);

  return (
    <Layout className="w-full h-fuil px-6">
      <View className="flex-1 pt-10 w-full gap-3">
        <View className="flex-row z">
          <Pressable onPress={() => goBack()}>
            <AntDesign name="arrowleft" size={24} color={fontColor} />
          </Pressable>
        </View>
        <View className="mt-3 gap-3">
          <Title className="mt-3">{title}</Title>
          <CustomText className="mt-1 text-lg">{description}</CustomText>
          <StatusBar status={stringToStatus(status)} />
          <View className="flex-row  items-center flex-wrap max-w-full">
            <AntDesign name="user" size={24} color={fontColor} />
            <CustomText
              className="text-justify leading-6 text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >{`${adminName.firstName} ${adminName.lastName}`}</CustomText>
          </View>
          <View className="flex-row items-center gap-2">
            <AntDesign name="calendar" size={24} color={fontColor} />
            <CustomText>Data da Entrega: {format(new Date(deadline), "dd/MM/yyyy")}</CustomText>
          </View>
        </View>
        {
          data &&
             <FlatList
                className="mt-5"
                data={data}
                renderItem={({ item, index }) => (
                  <StageCard stage={item} index={index + 1}/>
                )}
                numColumns={1}
                keyExtractor={(item) => item.id}
                
                />
        }

      </View>
    </Layout>

  )
}