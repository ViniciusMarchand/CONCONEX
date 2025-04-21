import { StatusBar, View } from "react-native";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View className="flex-1 justify-center items-center bg-primary-light dark:bg-primary-dark px-5">
                {children}
            </View>
        </>
    )
}