import { Text } from "react-native";
import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode,
  className?: string
}

export default function CustomText({ children, className }: Props) {
    return (
        <Text className={clsx("text-font-color dark:text-font-color-dark", className)}>
          {children}
        </Text>
    )
}