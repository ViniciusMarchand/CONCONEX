import CustomButton from "@/App/Components/Common/CustomButton";
import Inputs from "@/App/Components/Common/Inputs";
import Line from "@/App/Components/Common/Line";
import Title from "@/App/Components/Common/Title";
import TouchableText from "@/App/Components/Common/TouchableText";
import { Formik } from "formik";
import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NoAuthStackParamList } from "@/App/Types/NavigatorTypes";
import { NoAuthScreens } from "@/App/Constants/Screens";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import registrationValidationSchema from "@/App/Validations/RegistrationFormValidation copy";
import authApi from "@/App/Api/AuthApi";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { SignUpForm } from "@/App/Constants/Forms";

export default function SignUp() {
    const navigation = useNavigation<StackNavigationProp<NoAuthStackParamList>>();
    const { LoginScreen } = NoAuthScreens;

    const onSubmit = async (values: any) => {
        try {
            const formValues = await registrationValidationSchema.validate(values);
            await authApi.register(formValues);
            successToast('Usuário registrado com sucesso!');
            navigation.navigate(NoAuthScreens.EmailVerificationScreen, { email: formValues.email });
        } catch (error: any) {
            if(error.response?.data) {
                errorToast(translateError(error.response?.data));
            } else {
                errorToast(error.message);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            className="w-full flex-1"
            
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', width: '100%' }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Formik
                    initialValues={{ 
                        username: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    onSubmit={onSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <View className='flex-1 justify-center w-full gap-5 px-10'>
                            <View className='w-full'>
                                <View className='gap-2 my-4'>
                                    <Title className='text-center'>Crie sua conta</Title>
                                </View>
                            </View>
                            <View className="gap-4">
                                <Inputs handleChange={handleChange} InputsInfo={SignUpForm} />
                            </View>
                            <CustomButton onPress={() => handleSubmit()}>
                                Registrar-se
                            </CustomButton>
                            <Line />
                            <TouchableText
                                className='text-center text-tertiary dark:text-tertiary-dark'
                                onPress={() => navigation.navigate(LoginScreen)}
                            >
                                Já tenho uma conta
                            </TouchableText>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}