import { Image, View } from "react-native";
import CustomText from "../Common/CustomText";
import { format } from "date-fns";
import { Message } from "@/App/Types";
import { useAuth } from "@/App/Contexts/AuthContext";


export default function RenderMessage({ item }: { item: Message }) {

    const { user } = useAuth();

    function isUser(userId: string) {
        if (user?.id === userId) {
            return true;
        }
        return false;
    }

    return (
        <View className={`flex-row mb-3 ${isUser(item.userId) ? 'justify-end' : 'justify-start'}`}>

            <View
                className={`max-w-[80%] rounded-lg p-3 ${isUser(item.userId) ? 'bg-blue-500' : 'bg-secondary-dark'
                    }`}
            >
                {
                    !isUser(item.userId) &&
                    <CustomText className="font-bold">{`${item.userFirstName} ${item.userLastName}`}</CustomText>
                }
                <CustomText className={isUser(item.userId) ? 'text-white' : 'text-black'}>
                    {item.content}
                </CustomText>
                <CustomText
                    className={`text-xs mt-1 ${isUser(item.userId) ? 'text-blue-100' : 'text-gray-500'
                        }`}
                >
                    {format(item.sentAt, "dd/MM/yyyy HH:mm")}
                </CustomText>
            </View>
        </View>
    )
}
