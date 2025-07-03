import CustomText from "@/App/Components/Common/CustomText";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, TouchableOpacity, View } from "react-native";
import TextInput from "@/App/Components/Common/InputText";
import { Message, MessageDTO } from "@/App/Types";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import chatApi from "@/App/Api/ChatApi";
import RenderMessage from "@/App/Components/Chat/ChatBubble";
import { errorToast } from "@/App/Utils/Toasts";
import { apiUrl } from "@/App/Constants/Env";
import { useAuth } from "@/App/Contexts/AuthContext";
import { useSignalR } from "@/App/Contexts/SignalRContext";
import { Clipboard, Paperclip } from "lucide-react-native";

type ChatRouteProp = RouteProp<
  AuthStackParamList,
  'Chat'
>;

interface Props {
  route: ChatRouteProp;
}

export default function Messages({route} : Props) {
  const { projectTitle, projectId } = route.params;
  const navigation = useNavigation<StackNavigationProp<any>>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  
  const flatListRef = useRef<FlatList>(null);
  const { fontColor } = useColors();


  const loadMoreMessages = useCallback(async (pageToLoad: number) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const res = await chatApi.findMessages(projectId, pageToLoad, limit);

      
      if (res.data.length === 0) {
        setHasMore(false);
        return;
      }
      

      setMessages(prev => 
        pageToLoad === 1 
          ? [...res.data] 
          : [...prev, ...res.data]
      );
      
      setPage(pageToLoad);
      
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isLoading]);

  useEffect(() => {
    loadMoreMessages(1);
    chatApi.readMessages(projectId);
  }, []);

  const { message } = useSignalR();

  useEffect(() => {
    if (message && message.projectId === projectId) {
      setMessages(prev => [message, ...prev]);
    (async () => {
      await chatApi.readMessages(projectId);
    })()

    }
  },[message]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim()) return;
    
    const tempId = Date.now().toString();
    const newMsg: MessageDTO = {
      content: newMessage,
      projectId: projectId, 
    };
    
    setNewMessage('');

    try {
      const res = await chatApi.sendMessage(newMsg);
      setMessages(prev => [res.data, ...prev]);
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      errorToast("Erro ao enviar mensagem");
    }
    

  }, [newMessage, projectId]);

  const ListHeaderComponent = () => (
    <View className="py-2 mb-2">
      {isLoading && <ActivityIndicator size="small" color="#3b82f6" />}
    </View>
  );

  return (
    <View className="flex-1 bg-primary dark:bg-primary-dark">
      <View className="flex-row items-center p-4 border-b border-tertiary dark:border-tertiary-dark justify-center gap-3">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="flex-row h-full justify-end items-end"
        >
          <AntDesign name="arrowleft" size={24} color={fontColor} />
        </TouchableOpacity>
        <CustomText className="text-xl font-bold flex-1 pt-5">{projectTitle}</CustomText>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <RenderMessage item={item} />}
        keyExtractor={(_, index) => index.toString()}
        className="flex-1 pb-2 mt-2 px-4 "
        inverted={true}
        onEndReached={() => loadMoreMessages(page + 1)}
        onEndReachedThreshold={0}
        ListHeaderComponent={hasMore ? ListHeaderComponent : null}
        initialNumToRender={20}
        windowSize={21}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 30,
        }}
      />

      <View className="flex-row items-center p-3 border-t border-tertiary dark:border-tertiary-dark bg-primary dark:bg-primary-dark">
        <TextInput
          className="flex-1 rounded-full px-4 py-2 mr-3 h-[45px]"
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
          icon={Paperclip  }
          iconRight={true}
        
          />
        <TouchableOpacity
          className="bg-blue-500 flex-row rounded-full w-12 h-12 items-center justify-center text-center"
          onPress={handleSend}
        >
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}