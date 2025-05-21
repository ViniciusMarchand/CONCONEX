import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";

export default function CircularAddUserButton({...props} : TouchableOpacityProps) {

    const  { fontColor } = useColors();
    
    return ( 
        <TouchableOpacity className="flex justify-center items-center bg-green-600 dark:bg-green-500 rounded-[100%] p-1 w-[50px] h-[50px] absolute z-10 bottom-20 right-4" {...props}>
            <AntDesign name="adduser" size={35} color={fontColor} />
        </TouchableOpacity>
    )
}