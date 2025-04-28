import { GestureResponderEvent, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { ReactNode } from "react";

interface Props {
    className?: string;
    children?: ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
}

export default function TouchableText({ children, className, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress || (() => { })}>
            <CustomText className={className}>
                {children}
            </CustomText>
        </TouchableOpacity>
    );
}