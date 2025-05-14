import { ProjectsTabOptions } from "@/App/Constants";
import clsx from "clsx";
import { Pressable } from "react-native";
import CustomText from "../Common/CustomText";

interface Props {
    name: string,
    value: ProjectsTabOptions,
    tabSelected: ProjectsTabOptions,
    setTabSelected: Function
}

export default function TabButton({ name, value, tabSelected, setTabSelected }: Props) {
    return (
        <Pressable 
            className={clsx("w-1/2 justify-center items-center rounded-[10px]",
            tabSelected === value && "bg-secondary dark:bg-primary-dark")}
            onPress={() => setTabSelected(value)}
        >
            <CustomText>{name}</CustomText>
        </Pressable>
    )
}