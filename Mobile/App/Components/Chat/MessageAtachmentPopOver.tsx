

import React, { useCallback } from "react";
import { Popover, PopoverArrow, PopoverBackdrop, PopoverBody, PopoverContent } from "../Ui/popover";
import { Button, ButtonText } from "../Ui/button";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { Icon } from "../Ui/icon";
import CustomText from "../Common/CustomText";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
interface MessageAttachmentPopOverProps {
  onSelectFile: Function;
}

export default function MessageAtachmentPopOver({ onSelectFile }: MessageAttachmentPopOverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const onSendFile = () => {
    if (onSelectFile) {
      onSelectFile();
    }
    handleClose();
  };


  const selectImage = useCallback(async () => {
    handleClose();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      // Alert.alert('Permiss�o Negada', 'Precisamos de permiss�o para acessar sua galeria de imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      await onSelectFile(result.assets[0].uri, result.assets[0].mimeType || 'image/jpeg', result.assets[0].fileName || 'image.jpeg');
    }
  }, [handleClose, onSelectFile]);

const selectFile = useCallback(async () => {
  handleClose();
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const file = result.assets[0];
    await onSelectFile(file.uri, file.mimeType || 'application/octet-stream', file.name || 'document.pdf');
  }
}, [handleClose, onSelectFile]);


  return (
    <Popover
      isOpen={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      shouldFlip={true}
      trigger={(triggerProps: any) => {
        return (
          <TouchableOpacity {...triggerProps}>
            <AntDesign name="paperclip" size={24} color="white" />
          </TouchableOpacity>

        );
      }}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-full max-w-[420px] p-4">
        <PopoverArrow />
        <PopoverBody
          className=""
          contentContainerClassName="flex flex-row gap-4"
        >
          <View className="gap-2">
            <TouchableOpacity className="flex-row gap-2" onPress={selectFile}>
              <AntDesign name="file1" size={24} color="white" />
              <CustomText className="text-lg mb-2">Anexar arquivo</CustomText>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-2" onPress={selectImage}>
              <Entypo name="image" size={24} color="white" />
              <CustomText className="text-lg mb-2">
                Anexar imagem
              </CustomText>
            </TouchableOpacity>
          </View>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}