import { IIconComponentType } from "@gluestack-ui/icon/lib/createIcon";
import { Component } from "react";
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
    textArea: boolean;
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

export type User = {
    username:string;
    firstName:string;
    lastName:string;
    phoneNumber:string;
    email:string
}

export type LoginResponseDTO = {
    accessToken: string;
    user: User
}

export type Tab = {
    name:string;
    component: Component;
    icon: string;
}

export type ProjectResponseDTO = {
    id: string;
    title: string;
    description: string;
    status: string;
    deadline: Date;
    adminName: FullName;
    image?:string;
}

export type ProjectStage = {
    title:string;
    description:string;
    status:string;
    deadline:string;
    order:string;
    image?:string
}

export type FullName = {
    firstName: string;
    lastName: string;
}

export type ProjectRequestDTO = {
    title: string;
    description?: string;
    status: string;
    deadline: Date;
    // image?:string;
}