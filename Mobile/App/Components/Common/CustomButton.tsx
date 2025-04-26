import { Touchable, TouchableOpacity, TouchableOpacityProps } from "react-native";

import CustomText from "./CustomText";

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
}

export default function CustomButton({children, ...props}: Props) {
    return (
    <TouchableOpacity className=" bg-tertiary dark:bg-tertiary-dark hover:bg-blue-600 rounded-md" {...props}>
      <CustomText className="text-center text-md text-font-color-secondary dark:text-font-color-secondary-dark font-bold h-10 align-middle">
        {children}
      </CustomText>
    </TouchableOpacity>
  )
}