import authApi from "@/App/Api/AuthApi";
import CustomButton from "@/App/Components/Common/CustomButton";
import CustomText from "@/App/Components/Common/CustomText";
import TextInput from "@/App/Components/Common/InputText";
import Title from "@/App/Components/Common/Title";
import TouchableText from "@/App/Components/Common/TouchableText";
import { NoAuthScreens } from "@/App/Constants/Screens";
import { useCountdown } from "@/App/Hooks/useCountdown";
import { NoAuthStackParamList } from "@/App/Types/NavigatorTypes";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

type EmailVerificationRouteProp = RouteProp<
  NoAuthStackParamList,
  'EmailVerification'
>;

interface Props {
  route: EmailVerificationRouteProp;
  navigation: StackNavigationProp<NoAuthStackParamList, 'EmailVerification'>;
}

export default function EmailVerification({ route } : Props) {
    const { email } = route.params || { email: "" };
    const { reset, start, timeLeft } = useCountdown(60);
    const [code, setCode] = useState<string>("");

    const navigation = useNavigation<StackNavigationProp<NoAuthStackParamList>>();
    const { LoginScreen } = NoAuthScreens;
    

    const [hasResent, setHasResent] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!hasResent) {
                resendEmail();
                setHasResent(true);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [hasResent]);

    const resendEmail = async () => {
        try {
            await authApi.resendEmail(email);
            reset();
            start();
        } catch (error) {
            errorToast("Erro ao reenviar o e-mail de verificação. Tente novamente mais tarde.");
        }
    }

    const confirmEmail = async () => {
        try {
            await authApi.confirmEmail(email, code);
            successToast("E-mail confirmado com sucesso!");
            navigation.navigate(LoginScreen);
        } catch (error) {
            errorToast("Código inválido.");
        }
    }


    return (
        <View className=" py-36 w-full px-4 gap-10">
            <View className="gap-5">
                <Title className="text-start">Confirme seu e-mail</Title>
                <CustomText className="text-justify">Um código de confirmação foi enviado para o seu e-mail. Verifique sua caixa de entrada e também a pasta de spam.</CustomText>
            </View>
            <View className="gap-6">
                <TextInput 
                    className="text-lg"
                    placeholder="Insira o código aqui" 
                    onChangeText={setCode}
                    value={code}
                />
                <CustomButton onPress={() => confirmEmail()}>
                    Confirmar
                </CustomButton>
            </View>
            <View className="gap-3">
                <CustomText className="text-center">Não recebeu o e-mail?</CustomText>
                {
                    timeLeft === 0 ?
                    <TouchableText className="text-center" onPress={resendEmail}>Reenviar</TouchableText>
                    :
                    <CustomText className="text-center">Reenviar em {timeLeft}</CustomText>
                }
            </View>
        </View>
    )
}
