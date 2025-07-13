import { useGoogleAuth } from "@/App/Contexts/GoogleAuthContext";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { TouchableOpacity } from "react-native";

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