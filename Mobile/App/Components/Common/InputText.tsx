import { IIconComponentType } from "@gluestack-ui/icon/lib/createIcon";
import { Input, InputField, InputIcon, InputSlot } from "../Ui/input";
import { ColorValue, TextInputProps, Touchable, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";
import { createElement } from "react";

interface Props extends TextInputProps{
    icon?: IIconComponentType<SvgProps | any |{
        fill?: ColorValue;
        stroke?: ColorValue;
    }>,
    iconRight?:boolean,
    placeholder?:string,
    popOverElement?: any

}

export default function TextInput({icon, placeholder, iconRight, popOverElement, ...props} : Props) {
    return (
        <Input className="border-0 border-b-[1px] border-tertiary dark:border-tertiary-dark border-solid h-[40px] text-md" {...props}>
            {
                icon && !iconRight &&
                <InputSlot className="pl-3">
                    <InputIcon as={icon}/>
                </InputSlot>
            }
            <InputField 
                className="text-lg"
                placeholder={placeholder}
                {...props}
            />
            {
                icon && iconRight && !popOverElement ?
                <InputSlot className="">
                    <InputIcon as={icon}/>
                </InputSlot>
                :
                <InputSlot className="pr-3">
                    {
                        popOverElement
                    }
                </InputSlot>
            }

        </Input>
    )
}