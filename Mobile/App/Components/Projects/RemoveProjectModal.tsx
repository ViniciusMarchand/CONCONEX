import { TouchableOpacity, View } from "react-native"
import { useState } from "react"
import CustomText from "../Common/CustomText";
import CustomButton from "../Common/CustomButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal, ModalBackdrop, ModalBody, ModalContent } from "../Ui/modal";
import projectApi from "@/App/Api/ProjectApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { ProjectResponseDTO } from "@/App/Types";
import useColors from "@/App/Hooks/useColors";
import { useProjects } from "@/App/Contexts/ProjectsContext";
import { useNavigation } from "@react-navigation/native";

interface Props {
  project: ProjectResponseDTO,

}

export default function RemoveProjectModal({ project }: Props) {

  const [showModal, setShowModal] = useState(false);
  const { fontColor } = useColors();
  const { findProjects } = useProjects();
  const { goBack } = useNavigation();

  const removeProject = async () => {
    try {

      await projectApi.remove(project.id);
      successToast("Projeto removido com sucesso.");
      await findProjects();
      goBack();
      setShowModal(false);
    } catch (error: any) {
      if (error.response?.data) {
        errorToast(translateError(error.response?.data));
      } else {
        errorToast("Erro ao deletar projeto.");
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
                Você tem certeza que deseja remover o projeto "{project.title}"?
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
