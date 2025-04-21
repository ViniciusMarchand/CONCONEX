import { ReactNode } from "react";
import CustomText from "./CustomText";
import clsx from "clsx";

interface Props {
  children: ReactNode,
  className?: string,
}

export default function Title({ children, className } : Props) {
    return (
        <CustomText className={clsx("text-font-color dark:text-font-color-dark text-3xl", className)}>
          {children}
        </CustomText>
    )
}