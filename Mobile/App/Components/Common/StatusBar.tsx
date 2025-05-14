import { View } from "react-native";
import { CircularRadialGradient } from "./RadialGradient";
import { Status, stringToStatus } from "@/App/Constants";
import CustomText from "./CustomText";
import { translateStauts } from "@/App/Utils/EnumTranslations";

interface Props {
    status:Status
}

export default function StatusBar({status} : Props) {

    let colors = ["#AAAAAA", "#888888"]

    switch(status) {
        case Status.Canceld:
            colors = ["#FF0000", "#F55647"];
        break;
        case Status.InProgress:
            colors = ["#F4E204", "#F5EF89"];
        break;
        case Status.Completed:
            colors = ["#2BF400", "#8FF576"];
        break;
        default:
            colors = ["#AAAAAA", "#888888"]

            
    }

    return (
        <View className="rounded-[20px] bg-primary dark:bg-primary-dark h-10 w-40 border border-tertiary dark:border-tertiary-dark flex-row justify-start items-center px-3 gap-2">

            <CircularRadialGradient
                colors={colors}
                size={15}
            />
            <CustomText>
                {translateStauts(status)}
            </CustomText>
        </View>
    )
}