import { registerRootComponent } from 'expo';
import '../global.css';
import { colorScheme } from "nativewind";
import RootNavigator from './Navigators/RootNavigator';

colorScheme.set("dark"); 

export default function App() {

  return (
    <RootNavigator/>
  );
}

registerRootComponent(App);