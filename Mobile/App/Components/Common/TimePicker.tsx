import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CustomText from './CustomText'; // Assuming you have this component
import { format } from 'date-fns';
import useColors from '@/App/Hooks/useColors';
import { AvailablePeriodDTO } from '../Calendar/CalendarConfigs';

interface Props {
  onDateTimeSelect: (dateTime: Date) => void;
  initialDateTime?: Date;
  periods?: AvailablePeriodDTO[];
  dayOfWeek?: string;
  events?: any[];
}

const CustomDateTimePicker = ({ onDateTimeSelect, initialDateTime = new Date(), periods, dayOfWeek, events }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateTime);
  const [selectedHour, setSelectedHour] = useState<number | null>(initialDateTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number | null>(Math.floor(initialDateTime.getMinutes() / 30) * 30);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { fontColor } = useColors();
  const [hours, setHours] = useState<number[]>([]);
  const [minutes, setMinutes] = useState<number[]>([]);
  const [hasAlreadySelected, setHasAlreadySelected] = useState(false);

  useEffect(() => {
    if (!periods || !dayOfWeek) {
      setHours(Array.from({ length: 16 }, (_, i) => i + 7));
      setMinutes([0, 30]);
      return;
    }

    const availableHoursSet = new Set<number>();
    const bookedHoursSet = new Set<number>();

    const periodsForDay = periods.filter(p => p.dayOfWeek === dayOfWeek);

    periodsForDay.forEach(period => {
      const startHour = new Date(period.start).getHours();
      availableHoursSet.add(startHour);
    });

    if (events && events.length > 0 && selectedDate) {
      const eventsOnSelectedDay = events.filter(event => format(new Date(event.start.dateTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
      eventsOnSelectedDay.forEach(event => {
        bookedHoursSet.add(new Date(event.start.dateTime).getHours());
      });
    }

    const filteredHours = Array.from(availableHoursSet)
      .sort((a, b) => a - b)
      .filter(hour => hour >= 7 && hour <= 22 && !bookedHoursSet.has(hour));

    setHours(filteredHours);
    setMinutes([0, 30]);

    if (filteredHours.length > 0 && selectedHour === null) {
      setSelectedHour(filteredHours[0]);
    } else if (filteredHours.length > 0 && !filteredHours.includes(selectedHour as number)) {
      setSelectedHour(filteredHours[0]);
    }
  }, [periods, dayOfWeek, events, selectedDate]);


  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setHasAlreadySelected(true);
    const newDateTime = selectedDate;
    newDateTime.setHours(hour);
    newDateTime.setMinutes(minute);
    onDateTimeSelect(newDateTime);
    // setShowTimePicker(false); // Removed this line
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const getAvailableMinutesForHour = useCallback((selectedHour: number | null): number[] => {
    if (selectedHour === null || !periods || !dayOfWeek) {
      return [0, 30];
    }
    const availableMins: number[] = [];
    const periodsForDay = periods.filter(p => p.dayOfWeek === dayOfWeek);
    periodsForDay.forEach(period => {
      const startHour = new Date(period.start).getHours();
      const startMinute = new Date(period.start).getMinutes();
      if (startHour === selectedHour) {
        if (!availableMins.includes(startMinute)) {
          availableMins.push(startMinute);
        }
      }
    });
    return Array.from(new Set(availableMins)).sort((a, b) => a - b);
  }, [periods, dayOfWeek]);

  return (
    <View className="bg-primary dark:bg-primary-dark p-4 rounded-md my-5">
      <View className="mb-4">
        <TouchableOpacity onPress={toggleTimePicker} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <CustomText className="text-white">Selecionar Horário</CustomText>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <View className="flex-row">
          <View className="flex-1 mr-4">
            <CustomText className={`text-lg font-bold mb-2 ${fontColor}`}>Hora</CustomText>
            <ScrollView>
              {hours.map((hour) => (
                <TouchableOpacity
                  key={`hour-${hour}`}
                  className={`py-2 rounded-md ${selectedHour === hour ? 'bg-blue-200' : ''}`}
                  onPress={() => handleTimeSelect(hour, selectedMinute === null ? 0 : selectedMinute)}
                >
                  <CustomText className={`text-base ${fontColor}`}>{String(hour).padStart(2, '0')}</CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="flex-1">
            <CustomText className={`text-lg font-bold mb-2 ${fontColor}`}>Minuto</CustomText>
            <ScrollView>
              {getAvailableMinutesForHour(selectedHour).map((minute) => (
                <TouchableOpacity
                  key={`minute-${minute}`}
                  className={`py-2 rounded-md ${selectedMinute === minute ? 'bg-blue-200' : ''}`}
                  onPress={() => handleTimeSelect(selectedHour === null ? 7 : selectedHour, minute)}
                >
                  <CustomText className={`text-base ${fontColor}`}>{String(minute).padStart(2, '0')}</CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {!showTimePicker && hasAlreadySelected && (
        <CustomText className={`mt-4 text-center text-lg ${fontColor}`}>
          Horário Selecionado: {String(selectedHour === null ? '--' : String(selectedHour).padStart(2, '0'))}:{String(selectedMinute === null ? '--' : String(selectedMinute).padStart(2, '0'))}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional styles here if needed
});

export default CustomDateTimePicker;