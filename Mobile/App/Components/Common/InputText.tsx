import { IIconComponentType } from "@gluestack-ui/icon/lib/createIcon";
import { Input, InputField, InputIcon, InputSlot } from "../Ui/input";
import { ColorValue, TextInputProps } from "react-native";
import { SvgProps } from "react-native-svg";

interface Props extends TextInputProps{
    icon?: IIconComponentType<SvgProps | any |{
        fill?: ColorValue;
        stroke?: ColorValue;
    }>,
    placeholder?:string,

}

export default function TextInput({icon, placeholder, ...props} : Props) {
    return (
        <Input className="border-0 border-b-[1px] border-tertiary dark:border-tertiary-dark border-solid h-[40px] text-md" {...props}>
            {
                icon &&
                <InputSlot className="pl-3">
                    <InputIcon as={icon}/>
                </InputSlot>
            }
            <InputField 
                className="text-lg"
                placeholder={placeholder}
                {...props}
            />
        </Input>
    )
}