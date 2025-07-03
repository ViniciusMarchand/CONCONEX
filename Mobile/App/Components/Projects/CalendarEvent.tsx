import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, set } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { errorToast } from '@/App/Utils/Toasts';
import CustomText from '../Common/CustomText';
import { AvailablePeriodDTO } from '../Calendar/CalendarConfigs';
import useColors from '@/App/Hooks/useColors';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDateTimePicker from '../Common/TimePicker';
import CalendarApi from '@/App/Api/CalendarApi';
import { useGoogleAuth } from '@/App/Contexts/GoogleAuthContext';
import { delay } from '@/App/Utils';

interface Props {
  onChange: (date: Date) => void;
  avaliablePeriods?: AvailablePeriodDTO[];
  setHasAlreadySelected: Function;
}

const CalendarWithDisabling = ({ onChange, avaliablePeriods, setHasAlreadySelected }: Props) => {
  const { login, token } = useGoogleAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [dateTime, setDateTime] = useState<Date | null>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [Events, setEvents] = useState<any[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);
  const getDisabledDays = useCallback(() => {
    const disabled: Record<string, { disabled: boolean }> = {};
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 90);

    if (!avaliablePeriods || avaliablePeriods.length === 0) {
      let currentDate = new Date(today);
      while (currentDate <= futureDate) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        disabled[formattedDate] = { disabled: true };
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return disabled;
    }

    const allDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableDaysOfWeek = [...new Set(avaliablePeriods.map(p => p.dayOfWeek))];
    const unavailableDaysOfWeek = allDaysOfWeek.filter(day => !availableDaysOfWeek.includes(day));
    
    const checkDayIsFullyBooked = (date: Date, eventsOnDate: any[], periods: AvailablePeriodDTO[] | undefined): boolean => {
      if (!periods || periods.length === 0) {
        return eventsOnDate.length > 0;
      }
      
      const dayOfWeekToCheck = format(date, 'EEEE', { locale: enUS});
      const periodsForDay = periods.filter(p => p.dayOfWeek === dayOfWeekToCheck);
      
      if (periodsForDay.length === 0) {
        return eventsOnDate.length > 0;
      }
      
      return eventsOnDate.length >= periodsForDay.length;
    };
    
    let currentDate = new Date(today);
    while (currentDate <= futureDate) {
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      if (unavailableDaysOfWeek.includes(weekday)) {
        disabled[formattedDate] = { disabled: true };
      }
      
      if (Events && Events.length > 0) {
        const eventsOnCurrentDate = Events.filter(event => format(new Date(event.start.dateTime), 'yyyy-MM-dd') === formattedDate);
        if (checkDayIsFullyBooked(currentDate, eventsOnCurrentDate, avaliablePeriods)) {
          disabled[formattedDate] = { disabled: true };
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return disabled;
  }, [avaliablePeriods, Events]);

  useEffect(() => {
    const fecthEvents = async () => {
      try {
        await login();
        const res = await CalendarApi.listAppEvents();
        setEvents(res);

      } catch (error) {
        
      }
    }
    fecthEvents();
    }, []);

  const onDayPress = (day: { dateString: string }) => {
    const isDisabledDay = getDisabledDays()[day.dateString]?.disabled;
    if (!isDisabledDay) {
      const selectedDayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(day.dateString));
      setDayOfWeek(selectedDayOfWeek);
      setSelectedDate(day.dateString);
      const newDateTime = new Date(day.dateString);

      if (avaliablePeriods && avaliablePeriods.length > 0 && selectedDayOfWeek) {
        const firstPeriodForDay = avaliablePeriods.find(p => p.dayOfWeek === selectedDayOfWeek);
        if (firstPeriodForDay) {
          const [hourStr, minuteStr] = firstPeriodForDay.start.split(':');
          newDateTime.setHours(parseInt(hourStr, 10));
          newDateTime.setMinutes(parseInt(minuteStr, 10));
          setDateTime(newDateTime);
        } else {
          setDateTime(new Date(day.dateString));
        }
      } else {
        setDateTime(new Date(day.dateString));
      }
      setShowTimePicker(true);
    } else {
      errorToast('Dia Indisponível\nNão há horários de agendamento para este dia.');
    }
  };

  const onTimeChange = (selectedTime: Date | undefined) => {
    if (!dateTime) {
      return;
    }
    if (!selectedTime) {
      errorToast('Horário inválido. Por favor, selecione um horário válido.');
      return;
    }
    // setShowTimePicker(false);
    const dateTimeAux = dateTime;
    dateTimeAux.setHours(selectedTime.getHours());
    dateTimeAux.setMinutes(selectedTime.getMinutes());
    setDateTime(dateTimeAux);
    onChange(dateTimeAux);
    setHasAlreadySelected(true);
  };

  const { primary } = useColors();

  return (
    <View>
      <CustomText className="mb-2">Selecione a data:</CustomText>
      <Calendar
        markedDates={getDisabledDays()}
        onDayPress={onDayPress}
        minDate={format(new Date(), 'yyyy-MM-dd')}
        localization={ptBR}
        theme={{
          calendarBackground: primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDisabledColor: '#ffffff66',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          textDayHeaderColor: '#fff',
          arrowColor: '#fff',
        }}

      />
      {
        dateTime && showTimePicker && dayOfWeek && (
          <CustomDateTimePicker
            onDateTimeSelect={onTimeChange}
            dayOfWeek={dayOfWeek}
            periods={avaliablePeriods}
            initialDateTime={dateTime}
            events={Events}
          />
        )
      }

      {selectedDate ? (
        <CustomText className="mt-4 text-center" style={{ color: '#fff' }}>
          Agendamento para: {format(new Date(selectedDate), 'dd/MM/yyyy', { locale: ptBR })}
          {dateTime && showTimePicker === false ? ` às ${format(dateTime, 'HH:mm', { locale: ptBR })}` : ''}
        </CustomText>
      ) : (
        <CustomText className="mt-4 text-center" style={{ color: '#fff' }}>Selecione uma data para agendar</CustomText>
      )}
    </View>
  );
};

export default CalendarWithDisabling;