import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import CustomText from "../Common/CustomText";
import CustomButton from "../Common/CustomButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "../Ui/modal";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { ProjectStage } from "@/App/Types";
import useColors from "@/App/Hooks/useColors";
import { useProjects } from "@/App/Contexts/ProjectsContext";
import { useNavigation } from "@react-navigation/native";
import projectStagesApi from "@/App/Api/ProjectStagesApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  refresh:Function,
  id?:string,
  setIndexRef:Function,
  refreshCarousel:Function,
}

export default function RemoveProjectStageImageModal({ refresh, id, setIndexRef, refreshCarousel }: Props) {

  const [showModal, setShowModal] = useState(false);
  const { fontColor } = useColors();
  const { findProjects } = useProjects();

  const removeProjectStageImage = async () => {
    try {
      if(id) {
        
        await projectStagesApi.removeImage(id);
        successToast("Imagem removida com sucesso.");
        await findProjects();
        await refresh();
        refreshCarousel();
        setIndexRef(0);
        setShowModal(false);
      }
    } catch (error: any) {
      if (error.response?.data) {
        errorToast(translateError(error.response?.data));
      } else {
        errorToast("Erro ao deletar imagem.");
      }
    }
  }

  return (
    <>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <MaterialCommunityIcons name="image-remove" size={24} color={fontColor} />
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
            <CustomText className="text-lg text-justify">
                Você tem certeza que deseja remover a imagem em destaque?
            </CustomText>
            </ModalBody>
            <View className="gap-2 flex-row">
              <CustomButton className="w-1/2 bg-red-500 dark:bg-red-500" onPress={() => setShowModal(false)}>
                  Manter
              </CustomButton>
              <CustomButton className="w-1/2" onPress={() => removeProjectStageImage()}>
                  Remover
              </CustomButton>
            </View>
        </ModalContent>
        </Modal>
    </>
  )
}
