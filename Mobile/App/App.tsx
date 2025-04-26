import { registerRootComponent } from 'expo';
import "@/global.css";
import { GluestackUIProvider } from "@/App/Components/Ui/gluestack-ui-provider";
import '../global.css';
import RootNavigator from './Navigators/RootNavigator';
import Toast from 'react-native-toast-message';


export default function App() {

  return <GluestackUIProvider mode={'dark'}>
      <RootNavigator />
    <Toast/>
  </GluestackUIProvider>;
}

registerRootComponent(App);