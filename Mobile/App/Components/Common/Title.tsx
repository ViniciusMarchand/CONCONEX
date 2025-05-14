import { ReactNode } from "react";
import CustomText from "./CustomText";
import clsx from "clsx";
import { TextProps } from "react-native";

interface Props extends TextProps{
  children: ReactNode,
  className?: string,
}

export default function Title({ children, className, ...props } : Props) {
    return (
        <CustomText className={clsx("text-font-color dark:text-font-color-dark text-3xl capitalize", className)} {...props}>
          {children}
        </CustomText>
    )
}