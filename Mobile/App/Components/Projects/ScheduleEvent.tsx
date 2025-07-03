import { TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react"
import CustomText from "../Common/CustomText";
import CustomButton from "../Common/CustomButton";
import Entypo from '@expo/vector-icons/Entypo';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "../Ui/modal";
import projectApi from "@/App/Api/ProjectApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { ProjectResponseDTO } from "@/App/Types";
import useColors from "@/App/Hooks/useColors";
import { useProjects } from "@/App/Contexts/ProjectsContext";
import { useNavigation } from "@react-navigation/native";
import CalendarWithDisabling from "./CalendarEvent";
import { set, setDate } from "date-fns";
import CalendarApi from "@/App/Api/CalendarApi";
import { useGoogleAuth } from "@/App/Contexts/GoogleAuthContext";
import { CalendarConfigurationDTO } from "../Calendar/CalendarConfigs";
import { fetchUserInfoAsync } from "expo-auth-session";

interface Props {
  project: ProjectResponseDTO,
  userId:string;
}

export default function ScheduleMeeting({ project, userId }: Props) {

  const { login, getUserInfo } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { fontColor } = useColors();
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [calendarConfigs, setCalendarConfigs] = useState<CalendarConfigurationDTO | null>(null);
  const [hasALreadySelected, setHasAlreadySelected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const config = await CalendarApi.findByUserId(userId);
        setCalendarConfigs(config);
      } catch (error: any) {

      }
    })()
  }, []);

  useEffect(() => {
    const fetchGoogleAuthConfig = async () => {
      try {
        await login();
      } catch (error: any) {
      }
    }
    fetchGoogleAuthConfig();
  }
  , [login]);

  const onChange = (e: Date) => {
    setDateTime(e);
  }

  const openModal = () => {
    if(!calendarConfigs) {
      errorToast("O usuário não possui configurações de calendário.");
      return;
    } else {
      setShowModal(true);
    }
  }

  const schedule = async () => {
    if(isLoading) {
      return;
    }
    if(!dateTime) {
      errorToast("Por favor, selecione uma data e hora.");
      return;
    }

    if(!calendarConfigs) {
      return;
    }

    if(!hasALreadySelected) {
      errorToast("Por favor, selecione a hora e minuto.");
      return;
    }
    try {
      const userInfo = await getUserInfo();
      const userEmail = userInfo.email;
      if (!userEmail || !calendarConfigs.emailGoogle) {
        return;
      }
      
      setIsLoading(true);

      await CalendarApi.createMeeting({
        dateTime: dateTime,
        userEmail: userEmail,
        projectTitle: project.title,
        emailReceiver:calendarConfigs?.emailGoogle 
      });
      setShowModal(false);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        try {
            const userInfo = await getUserInfo();
        const userEmail = userInfo.email;

          await login();
          await CalendarApi.createMeeting({
            dateTime: dateTime,
            userEmail: userEmail,
            projectTitle: project.title,
            emailReceiver: calendarConfigs.emailGoogle ?? ""
          });
          setShowModal(false);
        } catch (reloginError) {
          errorToast("Ocorreu um erro ao tentar agendar.");
        }
      } else {
        errorToast("Ocorreu um erro ao tentar agendar.");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => openModal()}>
        <Entypo name="calendar" size={24} color={fontColor} style={ !calendarConfigs ? {opacity:0.4} : {}}/>
      </TouchableOpacity>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-primary dark:bg-primary-dark">
          <ModalBody>
            <View className="w-full">
              <CustomText className="text-lg text-center mb-5 ">
                Marque uma reunião sobre o projeto.
              </CustomText>
            </View>
            <View className="w-full flex justify-center items-center">
              <CalendarWithDisabling 
              onChange={onChange} 
              avaliablePeriods={calendarConfigs?.periods}
              setHasAlreadySelected={setHasAlreadySelected}
              />
            </View>
          </ModalBody>
          <View className="gap-2 flex-row">
            <CustomButton className="w-1/2 bg-red-500 dark:bg-red-500" onPress={() => setShowModal(false)}>
              Cancelar
            </CustomButton>
            <CustomButton className="w-1/2 bg-red-500 dark:bg-red-500" onPress={() => schedule()}>
              Marcar reunião
            </CustomButton>
          </View>
        </ModalContent>
      </Modal>
    </>
  )
}
