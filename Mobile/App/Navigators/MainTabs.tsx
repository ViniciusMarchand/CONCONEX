import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { AuthScreens } from "../Constants/Screens";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config';
import { useColorScheme } from "nativewind";
import { MainTabsList } from "../Constants/MainTabList";

const Tab = createBottomTabNavigator();

export default function MainTabs() {

  const fullConfig = resolveConfig(tailwindConfig);

  const { colorScheme } = useColorScheme();

  const themeColor = colorScheme === 'dark' ? 'dark' : 'DEFAULT';
  
  const { colors } = fullConfig.theme;;

  const secondary = colors.secondary[themeColor];

  return (
    <Tab.Navigator
      initialRouteName={AuthScreens.ProjectsScreen}
      screenOptions={{
       headerShown: false,
        tabBarStyle: {
          backgroundColor: secondary, 
          borderTopWidth: 0, 
          height: 60,  
          paddingBottom: 5, 
          paddingTop: 5,  
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 6,  
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarActiveTintColor: '#4F46E5', 
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,               
          marginBottom: 4,            
        },
        tabBarHideOnKeyboard: true,
      }}
    >

      {
        MainTabsList.map(({ name, component, icon }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? icon : `${icon}-outline`}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          
        ))
      }
    </Tab.Navigator>
  );
}