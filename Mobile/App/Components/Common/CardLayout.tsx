import clsx from "clsx"
import { ReactNode } from "react"
import { View } from "react-native"

interface Props {
    children: ReactNode,
    className?: string
}

export default function CardLayout({children, className}: Props) {
    return (
        <View className={clsx("bg-secondary dark:bg-secondary-dark rounded-[10px] shadow-hard-5 border border-tertiary-dark", className)}>
            {children}
        </View>
    )
}