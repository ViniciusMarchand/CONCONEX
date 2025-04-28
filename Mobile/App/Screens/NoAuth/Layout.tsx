import { StatusBar, View } from "react-native";
import { } from "expo-system-ui";
import { ReactNode } from "react";
import { setBackgroundColorAsync } from "expo-system-ui";

export default function Layout({ children }: { children: ReactNode }) {

    setBackgroundColorAsync('#000');

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View className="flex-1 justify-center items-center bg-primary-light dark:bg-primary-dark px-5">
                {children}
            </View>
        </>
    )
}