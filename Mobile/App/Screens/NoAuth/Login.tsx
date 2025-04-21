import Logo from 'App/Components/Common/Logo';
import Title from 'App/Components/Common/Title';
import { View } from 'react-native';

export default function Login() {



  return (
    <View className='w-full '>
      <Logo/>
      <View className='mb-5'>
      </View>
      <Title className='text-center'>Entrar</Title>
      <View>
        {/* <Input width={'100%'} /> */}
      </View>
    </View>
  );
} 