import { Linking, TouchableOpacity, View } from "react-native";
import CustomText from "../Common/CustomText";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CardLayout from "../Common/CardLayout";
import AntDesign from '@expo/vector-icons/AntDesign';
import useColors from "@/App/Hooks/useColors";
import CalendarApi from "@/App/Api/CalendarApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";

export interface CalendarEvent {
    id: string;
    summary?: string;
    description?: string;
    start?: { dateTime?: string; timeZone?: string; };
    end?: { dateTime?: string; timeZone?: string; };
    htmlLink?: string;
}

const EventCard = ({ event, refresh }: { event: CalendarEvent, refresh:Function }) => {
    const startTime = event.start?.dateTime ? new Date(event.start.dateTime) : null;
    const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : null;

    const { fontColor } = useColors();

    const handleLinkPress = () => {
        if (event.htmlLink) {
            Linking.openURL(event.htmlLink).catch((err) => console.error('Erro ao abrir link:', err));
        }
    };

    const deleteEvent = async () => {
        try {
        await CalendarApi.cancelAppEvent(event.id);
            successToast('Evento cancelado com sucesso!');
            await refresh();
        } catch (error) {
            errorToast('Não foi possível cancelar o evento. Tente novamente mais tarde.');
        }
    }

    return (
        <CardLayout className="p-4 mb-3 shadow-md">
            <View className="w-full flex-row justify-end mb-1">
                <TouchableOpacity onPress={async () => await deleteEvent()}>
                    <AntDesign name="delete" size={24} color={fontColor} />
                </TouchableOpacity>
            </View>
            <CustomText className="text-lg font-bold mb-2">{event.summary || 'Sem título'}</CustomText>
            {event.description && <CustomText className="text-gray-700 mb-2">{event.description}</CustomText>}
            {startTime && (
                <CustomText className="text-gray-600 text-sm mb-1">
                    Início: {format(startTime, 'dd \'de\' MMMM \'às\' HH:mm', { locale: ptBR })}
                </CustomText>
            )}
            {endTime && (
                <CustomText className="text-gray-600 text-sm mb-1">
                    Fim: {format(endTime, 'dd \'de\' MMMM \'às\' HH:mm', { locale: ptBR })}
                </CustomText>
            )}
            {event.htmlLink && 
            (
                <TouchableOpacity onPress={handleLinkPress}>
                    <CustomText className="text-blue-500 text-sm">
                        <CustomText className="font-bold text-gray-700">Link:</CustomText> {event.htmlLink}
                    </CustomText>
                </TouchableOpacity>
            )}
        </CardLayout>
    );
};

export default EventCard;