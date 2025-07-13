import { logoutAsync } from "@/App/Utils/SecureStore";
import { Button, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/App/Contexts/AuthContext";
import Layout from "@/App/Components/Common/Layout";
import CustomText from "@/App/Components/Common/CustomText";

export default function Profile() {

    const { logout, user } = useAuth();

    return (
            <View className="items-center justify-center  p-6 bg-primary dark:bg-primary-dark h-full">
                <View className="w-full max-w-sm rounded-lg p-6 flex-1 justify-between">
                    <View>
                        <CustomText className="mb-6 text-center text-3xl font-bold text-gray-800">
                            Perfil
                        </CustomText>

                        <View className="mb-4">
                            <CustomText className="text-lg font-semibold text-gray-700">Nome:</CustomText>
                            <CustomText className="text-xl  text-gray-900">{`${user?.firstName} ${user?.lastName}`}</CustomText>
                        </View>

                        <View className="mb-6">
                            <CustomText className="text-lg font-semibold text-gray-700">Email:</CustomText>
                            <CustomText className="text-xl text-gray-900">{user?.email}</CustomText>
                        </View>

                        <View className="mb-6">
                            <CustomText className="text-lg font-semibold text-gray-700">Username:</CustomText>
                            <CustomText className="text-xl text-gray-900">{user?.username}</CustomText>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => logout()}
                        className="w-full! rounded-md bg-red-500 py-3"
                    >
                        <CustomText className="text-center text-lg font-semibold text-white">
                            Desconectar
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </View>
    )
}