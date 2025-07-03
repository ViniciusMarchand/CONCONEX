import CustomButton from '@/App/Components/Common/CustomButton';
import CustomText from '@/App/Components/Common/CustomText';
import TextInput from '@/App/Components/Common/InputText';
import { LockIcon, MailIcon } from '@/App/Components/Ui/icon';
import Logo from 'App/Components/Common/Logo';
import Title from 'App/Components/Common/Title';
import { View } from 'react-native';
import { Formik } from 'formik';
import Line from '@/App/Components/Common/Line';
import TouchableText from '@/App/Components/Common/TouchableText';
import { useNavigation } from '@react-navigation/native';
import { AuthScreens, NoAuthScreens } from '@/App/Constants/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, NoAuthStackParamList } from '@/App/Types/NavigatorTypes';
import loginValidationSchema from '@/App/Validations/LoginFormValidation';
import { LoginFormValues } from '@/App/Types';
import authApi from '@/App/Api/AuthApi';
import { errorToast } from '@/App/Utils/Toasts';
import { useAuth } from '@/App/Contexts/AuthContext';
import { apiUrl } from '@/App/Constants/Env';
import { useEffect } from 'react';

export default function Login() {
  const navigationNoAuth = useNavigation<StackNavigationProp<NoAuthStackParamList>>();
  const navigationAuth = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const { SignUpScreen, EmailVerificationScreen } = NoAuthScreens;

  const { login } = useAuth();

  const onSubmit = async (values: LoginFormValues) => {

    try {
      const formValues = await loginValidationSchema.validate(values);
      await login(formValues); 

    } catch (error: any) {
      const { status } = error; 
      if(status === 401) {
        navigationNoAuth.navigate(EmailVerificationScreen, { email: values.email });
      } else {
        errorToast("Email ou senha inválidos");
      } 
    }
    
  }
  useEffect(() => {
    alert(apiUrl)
  }, []);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View className='flex-1 justify-center w-full gap-5'>
          <View className='w-full'>
            <View className='w-full flex justify-center items-center'>
              <Logo />
            </View>
            <View className='gap-2 my-4'>
              <Title className='text-center'>Bem-vindo!</Title>
              <CustomText className='text-center'>Identifique-se para acessar seus projetos</CustomText>
            </View>
          </View>
          
          <View className='px-10 gap-7'>
            <TextInput
              icon={MailIcon}
              placeholder='E-mail'
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            /> 

            <TextInput
              icon={LockIcon}
              placeholder='Senha'
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            <CustomButton onPress={() => handleSubmit()}>
              Entrar
            </CustomButton>
            <Line/>
            <TouchableText 
              className='text-center text-tertiary dark:text-tertiary-dark'
              onPress={() => navigationNoAuth.navigate(SignUpScreen)}
            > 
                Criar conta
            </TouchableText>
          </View>
        </View>
      )}
    </Formik>
  );
}