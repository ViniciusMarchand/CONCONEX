import { StatusBar, View } from "react-native";
import { } from "expo-system-ui";
import { ReactNode } from "react";
import { setBackgroundColorAsync } from "expo-system-ui";
import clsx from "clsx";

interface Props {
    children: ReactNode,
    className?:string
}

export default function Layout({ children, className } : Props) {

    setBackgroundColorAsync('#000');

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View className={clsx("flex-1 justify-center items-center bg-primary dark:bg-primary-dark px-5", className)}>
                {children}
            </View>
        </>
    )
}