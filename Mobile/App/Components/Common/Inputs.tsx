import { InputProps } from "@/App/Types";
import TextInput from "./InputText";

interface Props {
    handleChange: Function;
    InputsInfo: InputProps[]
}

export default function Inputs({handleChange, InputsInfo} : Props) {

    return (
        InputsInfo.map((input, index) => {
            return (
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