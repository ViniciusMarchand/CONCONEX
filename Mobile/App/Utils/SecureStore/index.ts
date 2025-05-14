import { AccessTokenKey } from '@/App/Constants';
import * as SecureStore from 'expo-secure-store';

export const setAccessToken = (token:string) => {
    SecureStore.setItem(AccessTokenKey, token);
}

export const getAccessToken = () => {
    return SecureStore.getItem(AccessTokenKey);
}

export const logoutAsync = async () => {
    await SecureStore.deleteItemAsync(AccessTokenKey);
}