import authApi from "@/App/Api/AuthApi";
import { googleCalendarClientId, googleCalendarClientSecret } from "@/App/Constants/Env";
import { useGoogleAuth } from "@/App/Contexts/GoogleAuthContext";
import * as AuthSession from 'expo-auth-session';
import { ClearGoogleAccessToken, setAccessToken, setGoogleAccessToken } from "@/App/Utils/SecureStore";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import CustomText from "./CustomText";

export default function GoogleLoginButton() {

  const { login } = useGoogleAuth();


  return (
    <>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => login()}
        accessibilityLanguage="pt-BR"
      />
      <TouchableOpacity
        onPress={async () => {
          const userInfo = await GoogleSignin.getCurrentUser();
          console.log("Current User:", userInfo);
        }}
      >
      </TouchableOpacity>
    </>
  );
}