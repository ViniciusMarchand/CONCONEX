import { IIconComponentType } from "@gluestack-ui/icon/lib/createIcon";
import { ColorValue, KeyboardTypeOptions } from "react-native";
import { SvgProps } from "react-native-svg";

export type InputProps = {
    name: string;
    icon: IIconComponentType<SvgProps | {
        fill?: ColorValue;
        stroke?: ColorValue;
    }> | undefined;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean | undefined;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean | undefined;
    textContentType?: "emailAddress" | "password" | "name" | "username" | "telephoneNumber" | undefined;
    maxLength?: number | undefined;
}

export type LoginFormValues = {
    email: string;
    password: string;
}

export type RegistrationFormValues = {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}
