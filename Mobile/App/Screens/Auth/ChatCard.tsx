import CustomText from "@/App/Components/Common/CustomText";
import { Chat } from "@/App/Types";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View, ImageSourcePropType, TouchableOpacityProps } from "react-native";
import  NoImage from "../../../Assets/img/no-image.png"
import { format } from "date-fns";
import { useAuth } from "@/App/Contexts/AuthContext";

interface Props extends TouchableOpacityProps {
    chat:Chat;
}

export default function ChatCard({ chat, ...props } : Props) {
    const navigation = useNavigation();
    const { user } = useAuth();
    return (
        <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-200"
        {...props}
        >
        <Image
            source={chat.projectImage ? { uri: chat.projectImage } : (NoImage as ImageSourcePropType)}
            className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
            <View className="flex-row justify-between items-center">
            <CustomText className="font-bold text-lg">{chat.projectTitle}</CustomText>
            {
                chat.lastMessage &&

                <CustomText className="text-gray-500 text-sm">{format(chat.lastMessage.sentAt, "dd/MM/yyyy HH:mm")}</CustomText>
            }
            </View>
            <View className="flex-row items-center mt-1">
                {
                    chat.lastMessage &&
                    <CustomText 
                        className={`flex-1 ${chat.unreadMessages > 0 ? 'font-semibold' : 'text-gray-500'}`}
                        numberOfLines={1}
                    >
                        {
                            chat.lastMessage.userId === user?.id ?
                            "Você: " + chat.lastMessage.content :
                            chat.lastMessage.content
                        }
                    </CustomText>
                }
            {chat.unreadMessages > 0 && (
                <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center ml-2">
                <CustomText className="text-white text-xs">{chat.unreadMessages}</CustomText>
                </View>
            )}
            </View>
        </View>
        </TouchableOpacity>
    )
}