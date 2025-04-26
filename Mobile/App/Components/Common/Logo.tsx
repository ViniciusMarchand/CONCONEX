import { Image } from "expo-image";
import { useColorScheme } from "nativewind";

import LogoLight from "../../../Assets/logos/logo_light_mode.png";
import LogoDark from "../../../Assets/logos/logo_dark_mode.png";

export default function Logo() {
    const { colorScheme } = useColorScheme();

    return (
        <Image
            source={colorScheme === "dark" ? LogoDark : LogoLight}
            style={{
                width: 300,
                height: 100, 
            }}
            contentFit="contain"
        />
    );
}