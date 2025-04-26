import CustomButton from '@/App/Components/Common/CustomButton';
import CustomText from '@/App/Components/Common/CustomText';
import InputText from '@/App/Components/Common/InputText';
import { LockIcon, MailIcon } from '@/App/Components/Ui/icon';
import Logo from 'App/Components/Common/Logo';
import Title from 'App/Components/Common/Title';
import { View } from 'react-native';
import { Formik } from 'formik';
import { useState } from 'react';
import validateLogin from '@/App/Validations/LoginFormValidation';
import Line from '@/App/Components/Common/Line';
import Toast from 'react-native-toast-message';
import TouchableText from '@/App/Components/Common/TouchableText';

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);

  const showToast = (text:string) => {
    Toast.show({
      type: 'error',
      text1: text,
      swipeable: true,
    });
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={values => {
        const errors: string[] = validateLogin(values);
        setErrors(errors);

        if (errors.length > 0) {
          showToast(errors[0]);
          return;
        }
        

        // login()
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View className='flex-1 justify-center w-full gap-5'>
          <View className='w-full'>
            <View className='w-full flex justify-center items-center'>
              <Logo />
            </View>
            <View className='gap-2 my-4'>
              <Title className='text-center'>Bem vindo!</Title>
              <CustomText className='text-center'>Identifique-se para acessar seus projetos</CustomText>
            </View>
          </View>
          
          <View className='px-10 gap-7'>
            <InputText
              icon={MailIcon}
              placeholder='E-mail'
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            /> 

            <InputText
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
              >
                Criar conta
            </TouchableText>
          </View>
        </View>
      )}
    </Formik>
  );
}