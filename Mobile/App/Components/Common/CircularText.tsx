import { View } from "react-native";
import CustomText from "./CustomText";

export default function CircularText({number} : {number:number}) {
    return (
        <View className="w-[25px] h-[25px] rounded-[100px] bg-primary dark:bg-primary-dark flex justify-center items-center mr-2">
            <CustomText>
                {number}
            </CustomText>
        </View>
    )
}