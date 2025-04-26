import { View } from "react-native";

export default function Line() {
    return (
        <View className='flex items-center justify-between'>
            <View className='w-64 border-b border-tertiary/30 dark:border-tertiary-dark/30'></View>
        </View>
    );
}