import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from '../../tailwind.config';
import { useColorScheme } from "nativewind";

export default function useColors() {
    const fullConfig = resolveConfig(tailwindConfig);

    const { colorScheme } = useColorScheme();

    const themeColor = colorScheme === 'dark' ? 'dark' : 'DEFAULT';

    const { colors } = fullConfig.theme;;

    const fontColor = colors["font-color"][themeColor]

    return {fontColor}
}