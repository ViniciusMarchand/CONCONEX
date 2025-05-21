import { Text, TextProps } from "react-native";
import { ReactNode } from "react";
import clsx from "clsx";

interface Props extends TextProps {
  children: ReactNode,
  className?: string
}

export default function CustomText({ children, className, ...props }: Props) {
    return (
      <Text className={clsx("text-font-color", "dark:text-font-color-dark ", className)} {...props}>
        {children}
      </Text>
    )
}