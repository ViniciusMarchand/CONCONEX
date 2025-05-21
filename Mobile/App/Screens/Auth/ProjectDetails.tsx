import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import Layout from "../NoAuth/Layout";
import CustomText from "@/App/Components/Common/CustomText";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";
import Title from "@/App/Components/Common/Title";
import projectStagesApi from "@/App/Api/ProjectStagesApi";
import StatusBar from "@/App/Components/Common/StatusBar";
import { stringToStatus } from "@/App/Constants";
import { format } from "date-fns";
import StageCard from "@/App/Components/Projects/StageCard";
import { useAuth } from "@/App/Contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import CircularAddUserButton from "@/App/Components/Common/CircularAddUserButton";
import AddUserModal from "@/App/Components/Projects/AddUserModal";
import RemoveProjectModal from "@/App/Components/Projects/RemoveProjectModal";
import Feather from '@expo/vector-icons/Feather';
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthScreens } from "@/App/Constants/Screens";
import CircularPlusButton from "@/App/Components/Common/CircularPlusButton";
import { ProjectStage } from "@/App/Types";

type ProjectDetailsRouteProp = RouteProp<
  AuthStackParamList,
  'ProjectDetails'
>;

interface Props {
  route: ProjectDetailsRouteProp;
}

export default function ProjectDetails({ route }: Props) {

  const { fontColor } = useColors();
  const { goBack, navigate } = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const { userInfo, deadline, description, id, status, title, adminId } = route.params;

  const [data, setData] = useState<ProjectStage[]>([]);
  const { user } = useAuth();
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const findProjectStages = useCallback(async () => {
    const res: any = await projectStagesApi.findByProjectId(id);
    setData(res.data);
  }, []);

  useEffect(() => {
    findProjectStages();
  }, [findProjectStages]);

  useFocusEffect(
    useCallback(() => {
      findProjectStages();
    }, [])
  );

  useEffect(() => {

    if (user?.id === adminId) {
      setIsAuth(true);
    }
  }, []);

  return (
    <Layout className="w-full h-fuil px-6">
      <View className="flex-1 pt-10 w-full gap-3">
        <View className="flex-row justify-between">
          <Pressable onPress={() => goBack()}>
            <AntDesign name="arrowleft" size={24} color={fontColor} />
          </Pressable>
          <View className="flex-row gap-2">
            {
              isAuth && <>
                <TouchableOpacity onPress={() => navigate(AuthScreens.ProjectFormScreen, route.params)}>
                  <Feather name="edit" size={24} color={fontColor} />
                </TouchableOpacity>
                <RemoveProjectModal project={route.params} />
              </>
            }
          </View>
        </View>
        {
          data &&
          <FlatList
            ListHeaderComponent={
              <View className="gap-2 pb-6">
                <Title>{title}</Title>
                <CustomText className="text-lg">{description}</CustomText>
                <StatusBar status={stringToStatus(status)} />
                <View className="flex-row  items-center flex-wrap max-w-full">
                  {
                    userInfo?.firstName ? <>
                      <AntDesign name="user" size={24} color={fontColor} />
                      <CustomText
                        className="text-justify leading-6 text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >{`${userInfo.firstName} ${userInfo.lastName}`}</CustomText>
                    </>
                      : <CustomText className="text-sm">Sem usuários cadastrados no projeto</CustomText>
                  }
                </View>
                <View className="flex-row items-center gap-2">
                  <AntDesign name="calendar" size={24} color={fontColor} />
                  <CustomText>Data da Entrega: {format(new Date(deadline), "dd/MM/yyyy")}</CustomText>
                </View>
              </View>
            }
            data={data}
            renderItem={({ item, index }) => (
              <StageCard 
                stage={{...item, projectId:id}} 
                index={index + 1} 
                refresh={findProjectStages} 
                isAuth={isAuth}
              />
            )}
            numColumns={1}

          />
        }

      </View>
      {
        isAuth &&
        <>
          <CircularAddUserButton onPress={() => setShowModal(true)} />
          <CircularPlusButton onPress={() => navigate(AuthScreens.ProjectStageFormScreen, {
            id: '',
            title: '',
            description: '',
            status: '',
            deadline: '',
            projectId: id,
          })} />
        </>

      }
      <AddUserModal showModal={showModal} setShowModal={setShowModal} projectId={id} />
    </Layout>

  )
}