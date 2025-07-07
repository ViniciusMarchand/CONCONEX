import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { contextError } from "../Constants/Errors";
import { ClearGoogleAccessToken, getGoogleAccessToken, setGoogleAccessToken } from "../Utils/SecureStore";
import { GoogleSignin, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { googleCalendarClientId, googleCalendarClientSecret } from "../Constants/Env";
import authApi from "../Api/AuthApi";

interface Props {
  children: ReactNode;
}

export interface GoogleAuthResponse {
  data?: {
    idToken?: string;
    scopes?: string[];
    serverAuthCode?: string | null;
    user?: {
      email?: string;
      familyName?: string;
      givenName?: string;
      id?: string;
      name?: string;
      photo?: string;
    };
  };
  type: "success" | "cancel" | "error";
  error?: string; 
}

const GoogleAuthContext = createContext<{
  token: string | null;  
  setToken: Function;
  login: Function;
  logout: Function;
  getUserInfo: Function;
}>({
  token: null,
  setToken: () => {},
  login: () => {},
  logout: () => {},
  getUserInfo: () => {},
});

export default function GoogleAuthProvider({ children }: Props) {
  const [token, setToken] = useState<string|null>("");
  
  useEffect(() => {
    // ClearGoogleAccessToken();
    setToken(null);
    setToken(getGoogleAccessToken());
  },[]);

  const getUserInfo = async () => {
    try {
      const userInfo = GoogleSignin.getCurrentUser();
      if (userInfo) {
        return userInfo.user;
      } else {
        console.log("No user is currently signed in");
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };


  const signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const { data } = await GoogleSignin.signIn();
        if(data?.serverAuthCode) {
          const tokens = await GoogleSignin.getTokens();
          const tokenString = tokens.accessToken;
          setGoogleAccessToken(tokenString);
          setToken(tokenString);
        }
      } catch (error) {
        if (isErrorWithCode(error)) {
          switch (error.code) {
            case statusCodes.IN_PROGRESS:
              console.log("Sign-in in progress");
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              console.log("Google Play Services not available");
              break;
            default:
              console.log("Unknown error", error);
          }
        } else {
          console.log("Non-Google error", error);
        }
      }
    };
  
    GoogleSignin.configure({
      webClientId: "531901674924-cu2ceuah3vp2givrtumr7qdmk7h7lam7.apps.googleusercontent.com",
      scopes: ["https://www.googleapis.com/auth/calendar.events", "profile", "email"],
      offlineAccess: true,
      
    });
  
    const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setToken(null);
      ClearGoogleAccessToken();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
    }
  };

  
  return (
    <GoogleAuthContext.Provider value={{ token, setToken, login:signIn, logout:signOut, getUserInfo:getUserInfo }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    contextError("useGoogleAuth");
  }
  return context;
};
