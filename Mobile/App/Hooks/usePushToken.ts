import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import userPushTokenApi from '../Api/UserPushTokenApi';

export const usePushToken = (userId: string) => {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de notificação negada');
        return;
      }

      try {        
        const token = (await Notifications.getExpoPushTokenAsync({
          projectId: '5bec6ab9-00ad-40b4-811b-b2b42b8bb400'
        })).data; 
        await userPushTokenApi.save({ userId: userId, token: token});

      } catch (error:any) {
        console.error('Erro ao obter o token de notificação:', error.message || error);
        return;
      }
    };

    registerForPushNotifications();
  }, [userId]);
};
