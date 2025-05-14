import { Touchable, TouchableOpacity, TouchableOpacityProps } from "react-native";

import CustomText from "./CustomText";
import clsx from "clsx";

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  className?:string
}

export default function CustomButton({children, className, ...props}: Props) {
    return (
    <TouchableOpacity className={clsx("bg-tertiary dark:bg-tertiary-dark rounded-md", className)} {...props}>
      <CustomText className="text-center text-md text-font-color-secondary dark:text-font-color-secondary-dark font-bold h-10 align-middle">
        {children}
      </CustomText>
    </TouchableOpacity>
  )
}