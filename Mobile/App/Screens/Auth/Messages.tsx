import CustomText from "@/App/Components/Common/CustomText";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, FlatList, Image, Pressable, TouchableOpacity, View } from "react-native";
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
import MessageAtachmentPopOver from "@/App/Components/Chat/MessageAtachmentPopOver";

type ChatRouteProp = RouteProp<
  AuthStackParamList,
  'Chat'
>;

interface Props {
  route: ChatRouteProp;
}

type SelectedFile = {
  uri: string;
  mimeType: string;
  name: string;
};

export default function Messages({ route }: Props) {
  const { projectTitle, projectId } = route.params;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [messageAtachment, setMessageAttachment] = useState<string | null>(null);
  const limit = 20;
  const [imageOrFile, setImageOrFile] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const { fontColor } = useColors();

  const appState = useRef(AppState.currentState);

  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

const onSelectFile = (uri: string, mimeType: string, name: string) => {
  setSelectedFile({ uri, mimeType, name });
};


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
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {

        setMessages([]);
        setIsLoading(false);
        setHasMore(true);
        setPage(1);
        loadMoreMessages(1);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [projectId, loadMoreMessages, setMessages, setIsLoading, setHasMore, setPage]);

  useEffect(() => {
    if (message && message.projectId === projectId) {
      setMessages(prev => [message, ...prev]);
      (async () => {
        await chatApi.readMessages(projectId);
      })()

    }
  }, [message]);

const handleSend = useCallback(async () => {
  if (!newMessage.trim() && !selectedFile) return;

  const formData = new FormData();


  formData.append('content', newMessage ? newMessage :  "\u200B");
  formData.append('projectId', projectId);


  if (selectedFile) {
    const file: any = {
      uri: selectedFile.uri,
      type: selectedFile.mimeType,
      name: selectedFile.name,
    };
    formData.append('attachment', file);
  }

  setNewMessage('');
  setSelectedFile(null);

  try {
    const res = await chatApi.sendMessage(formData);
    setMessages(prev => [res.data, ...prev]);
  } catch (error) {
    errorToast("Erro ao enviar mensagem");
  }
}, [newMessage, projectId, selectedFile]);


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
      {selectedFile && (
  <View className="flex-row items-center p-3 border-t border-tertiary dark:border-tertiary-dark bg-primary dark:bg-primary-dark w-full">
    {selectedFile.mimeType.startsWith('image/') ? (
      <FontAwesome name="image" size={24} color="#4B5563" className="mr-2" />
    ) : (
      <FontAwesome name="file" size={24} color="#4B5563" className="mr-2" />
    )}

    <CustomText numberOfLines={1} className="flex-1 CustomText-sm text-foreground dark:text-foreground-dark mr-2">
      {selectedFile.name}
    </CustomText>

    <TouchableOpacity onPress={() => setSelectedFile(null)}>
      <FontAwesome name="close" size={20} color="#EF4444" />
    </TouchableOpacity>
  </View>
)}
      <View className="flex-row items-center p-3 border-t border-tertiary dark:border-tertiary-dark bg-primary dark:bg-primary-dark" w-full>
        <TextInput
          className="flex-1 rounded-full px-4 py-2 mr-3 h-[45px]"
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
          icon={Paperclip}
          iconRight={true}
          popOverElement={ <MessageAtachmentPopOver 
          onSelectFile={onSelectFile}
          />}

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