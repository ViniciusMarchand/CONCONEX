
import { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';
import { format } from 'date-fns';

interface DateInputProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
}

export default function DateInput({ label, value, onChange }: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      {label && <CustomText className='text-gray-500 dark:text-gray-400 text-lg mb-1'>{label}</CustomText>}

      <Pressable className='border border-tertiary dark:border-tertiary rounded-[8px] px-[12px] flex-row py-[10px] justify-between' onPress={() => setShowPicker(true)}>
        <CustomText>{format(value, "dd/MM/yyyy")}</CustomText>
        <Ionicons name="calendar-outline" size={20} color="#888" />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

