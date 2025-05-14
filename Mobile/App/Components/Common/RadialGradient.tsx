import { View } from "react-native";
import Svg, { Defs, RadialGradient as SVGRadialGradient, Rect, Stop } from "react-native-svg";

export const CircularRadialGradient = ({
  colors = ["#FF00FF", "#00FFFF"],
  size = 200, 
}) => {
  return (
    <View 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        overflow: "hidden", 
      }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <SVGRadialGradient
            id="grad"
            cx="50%" 
            cy="50%" 
            r="50%"  
            gradientUnits="userSpaceOnUse"
          >
            {colors.map((color, index) => (
              <Stop 
                key={index} 
                offset={`${(index / (colors.length - 1)) * 100}%`} 
                stopColor={color} 
              />
            ))}
          </SVGRadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};