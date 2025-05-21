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
    id:string;
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
    userInfo: UserInfoDTO;
    adminId:string;
    image?:string;
}

export type ProjectStageResponseDTO = {
    id: string | undefined;
    title: string | undefined;
    description: string | undefined;
    status: string | undefined;
    deadline: Date | undefined;
    adminId:string | undefined;
    image?:string | undefined;
    projectId:string | undefined;
}

export type Image = {
    id: string,
    path: string,
    fileExtension: string,
    projectStageId: string,
}

export type ProjectStage = {
    id:string
    title:string;
    description:string;
    status:string;
    deadline:string;
    order?:string;
    image?:string,
    projectId:string,
    images: Image[]
}

export type UserInfoDTO = {
    firstName: string;
    lastName: string;
    userId:string;
}

export type ProjectRequestDTO = {
    title: string;
    description?: string;
    status: string;
    deadline: Date;
    // image?:string;
}

export type ProjectStageRequestDTO = {
    title: string;
    description?: string;
    status: string;
    deadline: Date;
    // image?:string;
}

export type AddUserRequest = {
    projectId: string;
    username:string;
}