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

interface Props {
  stage: ProjectStage,
  refresh:Function

}

export default function RemoveProjectStageModal({ stage, refresh }: Props) {

  const [showModal, setShowModal] = useState(false);
  const { fontColor } = useColors();
  const { findProjects } = useProjects();

  const removeProject = async () => {
    try {
      if(stage.id) {
        await projectStagesApi.remove(stage.id);
        successToast("Etapa removida com sucesso.");
        await findProjects();
        refresh();
        setShowModal(false);
      }
    } catch (error: any) {
      if (error.response?.data) {
        errorToast(translateError(error.response?.data));
      } else {
        errorToast("Erro ao deletar etapa.");
      }
    }
  }

  return (
    <>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <AntDesign name="delete" size={24} color={fontColor} />
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
                Você tem certeza que deseja remover a etapa "{stage.title}"?
            </CustomText>
            </ModalBody>
            <View className="gap-2 flex-row">
              <CustomButton className="w-1/2 bg-red-500 dark:bg-red-500" onPress={() => setShowModal(false)}>
                  Manter
              </CustomButton>
              <CustomButton className="w-1/2" onPress={() => removeProject()}>
                  Remover
              </CustomButton>
            </View>
        </ModalContent>
        </Modal>
    </>
  )
}
