import { View, FlatList, StatusBar, AppState } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import CustomText from '@/App/Components/Common/CustomText'
import ChatCard from '../../Components/Chat/ChatCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chat } from '@/App/Types'
import chatApi from '@/App/Api/ChatApi'
import { AuthStackParamList } from '@/App/Types/NavigatorTypes'
import { AuthScreens } from '@/App/Constants/Screens'
import { useSignalR } from '@/App/Contexts/SignalRContext'

export default function Chats() {
  const { navigate } = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const [chats, setChats] = useState<Chat[]>([]);

  const appState = useRef(AppState.currentState);

  const findChats = useCallback(() => {
    try {
      (async () => {
        const res = await chatApi.findChats();
        setChats(res.data);
      })()

    } catch (error) {

    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      findChats();
    }, [])
  );

    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          findChats();
        }
        appState.current = nextAppState;
      });
  
      return () => {
        subscription.remove();
      };
    }, []);

  const { message, setMessage } = useSignalR();

  useEffect(() => {
    if (message) {
      const chat = chats.find((chat) => chat.projectId === message.projectId);
      if (chat) {
        setChats((prevChats) =>
          prevChats.map((prevChat) =>
            prevChat.projectId === chat.projectId ? { ...prevChat, lastMessage: message, unreadMessages:(chat.unreadMessages + 1) } : prevChat
          )
        );
        setMessage(undefined);
      } else {
        // setChats((prevChats) => [...prevChats, { ...message, projectId: message.projectId }]);
      }
    }
  }, [message]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View className="flex-1 bg-primary dark:bg-primary-dark pt-5">
        <View className="p-4 border-b border-gray-200">
          <CustomText className="text-2xl font-bold">Conversas</CustomText>
        </View>

        <FlatList
          data={chats}
          renderItem={({ item }) => <ChatCard chat={item} onPress={() => navigate(AuthScreens.ChatScreen, item)} />}
          keyExtractor={(item) => item.projectId}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  )
}