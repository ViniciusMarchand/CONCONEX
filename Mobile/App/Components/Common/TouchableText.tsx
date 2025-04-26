import { TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { ReactNode } from "react";

interface Props {
    className?: string;
    children?: ReactNode;
}

export default function TouchableText({ children, className }: Props) {
    return (
        <TouchableOpacity>
            <CustomText className={className}>
                {children}
            </CustomText>
        </TouchableOpacity>
    );
}