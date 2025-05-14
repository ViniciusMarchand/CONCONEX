import { InputProps } from "@/App/Types";
import TextInput from "./InputText";
import { Textarea, TextareaInput } from "../Ui/textarea";
import CustomText from "./CustomText";
import { View } from "react-native";

interface Props {
    handleChange: Function;
    InputsInfo: InputProps[]
}

export default function Inputs({handleChange, InputsInfo} : Props) {

    return (
        InputsInfo.map((input, index) => {
            return (
                input.textArea ?
                <View key={index}>
                    <CustomText className="pb-1 text-lg dark:text-gray-400">{input.placeholder}</CustomText>
                    <Textarea>
                        <TextareaInput 
                            key={index}
                            // placeholder={input.placeholder}
                            icon={input.icon}
                            onChangeText={handleChange(input.name)}
                            autoCapitalize={input?.autoCapitalize}
                            textContentType={input?.textContentType}
                            secureTextEntry={input?.secureTextEntry}
                            autoCorrect={input?.autoCorrect}
                            keyboardType={input?.keyboardType}
                        />
                    </Textarea>
                </View>
                :
                <TextInput
                    key={index}
                    placeholder={input.placeholder}
                    icon={input.icon}
                    onChangeText={handleChange(input.name)}
                    autoCapitalize={input?.autoCapitalize}
                    textContentType={input?.textContentType}
                    secureTextEntry={input?.secureTextEntry}
                    autoCorrect={input?.autoCorrect}
                    keyboardType={input?.keyboardType}
                />     
            )
        })
    )
}