import { Button, View } from "react-native"
import { useState } from "react"
import CustomText from "../Common/CustomText";
import CustomButton from "../Common/CustomButton";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../Ui/modal";
import { CloseIcon, Icon } from "../Ui/icon";
import TextInput from "../Common/InputText";
import projectApi from "@/App/Api/ProjectApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";

interface Props {
  showModal: boolean,
  setShowModal: Function,
  projectId: string,

}

export default function AddUserModal({ setShowModal, showModal, projectId }: Props) {

  const [username, setUsername] = useState("");

  const addUserToProject = async () => {
    try {
      if (!username) {
        throw new Error("Insira um nome de usuário");
      }
      await projectApi.addUser({ projectId, username });
      successToast("Cliente adicionado com sucesso!");
      setShowModal(false);
    } catch (error: any) {
      if (error.response?.data) {
        errorToast(translateError(error.response?.data));
      } else {
        errorToast(error.message);
      }
    }
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className="bg-primary dark:bg-primary-dark">
        <ModalHeader>
          {/* <Heading size="md" className="text-typography-950">
              Invite your team
            </Heading> */}
          {/* <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton> */}
        </ModalHeader>
        <ModalBody>
          <CustomText className="text-lg">
            Adicione um cliente ao seu projeto.
          </CustomText>
          <TextInput
            placeholder="digite o nome de usuário do cliente"
            className="text-center"
            onChangeText={(e) => setUsername(e)}
            value={username}
          />
        </ModalBody>
        <View className="gap-2 flex-row">
          <CustomButton className="w-1/2 bg-red-500 dark:bg-red-500" onPress={() => setShowModal(false)}>
            Cancelar
          </CustomButton>
          <CustomButton className="w-1/2" onPress={() => addUserToProject()}>
            Adicionar
          </CustomButton>
        </View>
        {/* <ModalFooter className="w-full">
            <CustomButton className="w-[200px]">
              <CustomText className="text-red-500 dark:text-secondary-dark">aaa</CustomText>
            </CustomButton>
            <CustomButton
              onPress={() => {
                setShowModal(false)
              }}
            >
              <CustomText>Explore</CustomText>
            </CustomButton>
          </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}
