import { AccessTokenKey, GoogleAccessTokenKey, GoogleRefreshTokenKey } from '@/App/Constants';
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

export const getGoogleAccessToken = () => {
    return SecureStore.getItem(GoogleAccessTokenKey);
}

export const setGoogleAccessToken = (token:string) => {
    SecureStore.setItem(GoogleAccessTokenKey, token);
}

export const ClearGoogleAccessToken = () => {
    SecureStore.deleteItemAsync(GoogleAccessTokenKey);
}

export const setGoogleRefreshToken = (token:string) => {
    SecureStore.setItem(GoogleRefreshTokenKey, token);
}

export const ClearGoogleRefreshToken = () => {
    SecureStore.deleteItemAsync(GoogleRefreshTokenKey);
}