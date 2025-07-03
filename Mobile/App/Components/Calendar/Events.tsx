import { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import EventCard, { CalendarEvent } from './EventCard';
import CalendarApi from '@/App/Api/CalendarApi';
import CustomText from '../Common/CustomText';
import Fontisto from '@expo/vector-icons/Fontisto';
import useColors from '@/App/Hooks/useColors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/App/Types/NavigatorTypes';
import { AuthScreens } from '@/App/Constants/Screens';

const Events = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { CalendarConfigsScreen } = AuthScreens;
    const { navigate } = useNavigation<StackNavigationProp<AuthStackParamList>>();
    
    const { fontColor } = useColors();

    const getEvents = useCallback(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedEvents = await CalendarApi.listAppEvents();
                setEvents(fetchedEvents || []);
            } catch (err: any) {
                console.error("Erro ao buscar eventos:", err);
                setError('Erro ao carregar os eventos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    if (loading) {
        return <CustomText className="p-4">Carregando eventos...</CustomText>;
    }

    if (error) {
        return <CustomText className="p-4 text-red-500">Erro: {error}</CustomText>;
    }

    if (!events || events.length === 0) {
        return <>
         <View className='mt-16 w-full flex-row items justify-end px-3 absolute top-0 right-3'>
            <TouchableOpacity onPress={() => navigate(CalendarConfigsScreen)}>
                <Fontisto name="player-settings" className='mb-5' size={30} color={fontColor} />
            </TouchableOpacity>
        </View>
        <CustomText className="p-4">Nenhum evento criado por este aplicativo encontrado.</CustomText>
        
        </> 
        
    }

    return (
        <>
        <View className='mt-16 w-full flex-row items justify-end px-3'>
            <TouchableOpacity onPress={() => navigate(CalendarConfigsScreen)}>
                <Fontisto name="player-settings" className='mb-5' size={30} color={fontColor} />
            </TouchableOpacity>
        </View>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EventCard event={item} refresh={getEvents}/>}
                className='flex-1'
                contentContainerStyle={{padding:5}}
            />
        </>
    );
};

export default Events;