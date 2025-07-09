import { Image, Linking, Pressable, View } from "react-native";
import CustomText from "../Common/CustomText";
import { format } from "date-fns";
import { Message } from "@/App/Types";
import { useAuth } from "@/App/Contexts/AuthContext";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ImageView from "react-native-image-viewing";

export default function RenderMessage({ item }: { item: Message }) {
  const { user } = useAuth();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const isOwnMessage = user?.id === item.userId;

  const openFile = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error("Erro ao abrir arquivo:", err);
    }
  };

  const renderAttachment = () => {
    if (!item?.attachments || !item?.attachments[0]?.url) return null;

    const isImage = item?.attachments[0].type?.startsWith("image/");

    if (isImage) {
      return (
        <>
          <Pressable onPress={() => setImageViewerVisible(true)}>
            <Image
              source={{ uri: item?.attachments[0].url }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
                marginBottom: 8,
                alignSelf: isOwnMessage ? "flex-end" : "flex-start",
              }}
            />
          </Pressable>
          <ImageView
            images={[{ uri: item?.attachments[0].url }]}
            imageIndex={0}
            visible={imageViewerVisible}
            onRequestClose={() => setImageViewerVisible(false)}
            swipeToCloseEnabled
            doubleTapToZoomEnabled
          />
        </>
      );
    }

    return (
      <Pressable
        onPress={() => openFile(item?.attachments[0].url)}
        className={`w-full flex-row items-center p-2 mb-2 justify-center rounded bg-tertiary dark:bg-tertiary-dark ${
          isOwnMessage ? "self-end" : "self-start"
        }`}
        style={{ maxWidth: '80%' }}
      >

        <FontAwesome name="file" size={20} color="#4B5563" />
      </Pressable>
    );
  };

  return (
    <View className={`flex-row mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] rounded-lg p-3 ${
          isOwnMessage ? "bg-blue-500" : "bg-secondary-dark"
        }`}
      >
        {renderAttachment()}

        {!isOwnMessage && (
          <CustomText className="font-bold">
            {`${item.userFirstName} ${item.userLastName}`}
          </CustomText>
        )}

        {!!item.content && (
          <CustomText className={isOwnMessage ? "text-white" : "text-black"}>
            {item.content}
          </CustomText>
        )}

        <CustomText
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {format(item.sentAt, "dd/MM/yyyy HH:mm")}
        </CustomText>
      </View>
    </View>
  );
}
