import React, { useEffect, useState } from 'react';
import { View, Switch, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from '../Common/CustomText';
import { traduzirDiaDaSemana } from '@/App/Constants';
import { useAuth } from '@/App/Contexts/AuthContext';
import { useGoogleAuth } from '@/App/Contexts/GoogleAuthContext';
import CalendarApi from '@/App/Api/CalendarApi';
import { errorToast, successToast } from '@/App/Utils/Toasts';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useColors from '@/App/Hooks/useColors';
import CustomDateTimePicker from '../Common/TimePicker';

interface ScheduleExceptionDTO {
  start: string;
  end: string;
}

export interface AvailablePeriodDTO {
  start: string;
  dayOfWeek: string;
}

export interface CalendarConfigurationDTO {
  userId: string;
  emailGoogle?: string;
  exceptions: ScheduleExceptionDTO[];
  periods: AvailablePeriodDTO[];
  isActive?: boolean;
}

interface DayOfWeekItem {
  label: string;
  value:
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}


const CalendarConfigs = () => {
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [enableInterviewScheduling, setEnableInterviewScheduling] = useState(false);
  const [exceptions, setExceptions] = useState<ScheduleExceptionDTO[]>([]);
  const [periods, setPeriods] = useState<AvailablePeriodDTO[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { goBack } = useNavigation();
  const [showTimePickerStart, setShowTimePickerStart] = useState(false);
  const [showTimePickerEnd, setShowTimePickerEnd] = useState(false);
  const [currentTimePicker, setCurrentTimePicker] = useState<'start' | 'end' | null>(null);
  const [tempPeriod, setTempPeriod] = useState({ start: new Date(), end: new Date() });
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const { user } = useAuth();
  const { fontColor } = useColors();
  const [selectedDayForPeriod, setSelectedDayForPeriod] = useState<
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
    | null
  >(null);

  const daysOfWeek: DayOfWeekItem[] = [
    { label: 'Segunda', value: 'Monday', state: monday, setState: setMonday },
    { label: 'Terça', value: 'Tuesday', state: tuesday, setState: setTuesday },
    { label: 'Quarta', value: 'Wednesday', state: wednesday, setState: setWednesday },
    { label: 'Quinta', value: 'Thursday', state: thursday, setState: setThursday },
    { label: 'Sexta', value: 'Friday', state: friday, setState: setFriday },
    { label: 'Sábado', value: 'Saturday', state: saturday, setState: setSaturday },
    { label: 'Domingo', value: 'Sunday', state: sunday, setState: setSunday },
  ];

  const { getUserInfo } = useGoogleAuth();

  useEffect(() => {
    const fetchCalendarConfig = async () => {
      try {
        if (!user?.id) return;

        const config = await CalendarApi.findByUserId(user.id);
        if (config) {
          setEnableInterviewScheduling(config.isActive || false);
          setPeriods(config.periods || []);
          setExceptions(config.exceptions || []);
        }
      } catch (error) {
        console.error("Error fetching calendar configuration:", error);
      }
    };

    fetchCalendarConfig();
  }, [])

  const onSave = async (config: CalendarConfigurationDTO) => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo) {
        config.emailGoogle = userInfo.email;
        await CalendarApi.saveConfigs(config);
        successToast("Configuração do calendário salva com sucesso!");
        goBack();
      }
    } catch (error) {
      console.error("Error saving calendar configuration:", error);
      errorToast("Erro ao salvar configuração do calendário. Por favor, tente novamente.");
    }
  }

  const handleTimeChange = (selectedTime?: Date) => {
    if (selectedTime) {
      const newTime = new Date(selectedTime);
        setTempPeriod(prev => {
          return { ...prev, start: newTime };
        });
        setShowTimePickerStart(false);
    } else {
      setShowTimePickerStart(false);
      setShowTimePickerEnd(false);
    }
  };

  const addPeriod = () => {
    if (selectedDayForPeriod) {
      const newPeriod: AvailablePeriodDTO = {
        start: tempPeriod.start.toISOString(),
        dayOfWeek: selectedDayForPeriod.toUpperCase(),
      };
      setPeriods([...periods, newPeriod]);
      setIsAddingPeriod(false);
      setSelectedDayForPeriod(null);
      setTempPeriod({ start: new Date(), end: new Date() });
    } else {
      alert('Por favor, selecione um dia da semana.');
    }
  };

  const removePeriod = (index: number) => {
    const newPeriods = [...periods];
    newPeriods.splice(index, 1);
    setPeriods(newPeriods);
  };


  const handleSaveConfiguration = () => {
    if (!user?.id) {
      return;
    }

    const configToSend: CalendarConfigurationDTO = {
      userId: user.id,
      exceptions: exceptions.map(ex => ({
        start: ex.start,
        end: ex.end,
      })),
      periods: periods.map(period => ({
        start: period.start,
        dayOfWeek: period.dayOfWeek,
      })),
      isActive: enableInterviewScheduling,
    };
    onSave(configToSend);
  };

  return (
    <>
      <View className="bg-primary dark:bg-primary-dark pt-14 px-7">
        <TouchableOpacity onPress={() => goBack()} >
          <Ionicons name="arrow-back" size={24} color={fontColor} />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4 bg-primary dark:bg-primary-dark pt-5">
        <View className="mb-4 p-4 bg-secondary dark:bg-secondary-dark rounded-md shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <CustomText className="text-lg font-semibold">Agendamento de Entrevistas</CustomText>
            <Switch
              value={enableInterviewScheduling}
              onValueChange={(e) => { setEnableInterviewScheduling(e); setIsDisabled(e) }}

            />
          </View>
          <CustomText className="text-sm text-gray-500">Ative para permitir agendamentos de entrevistas.</CustomText>
        </View>

        <View className="mb-4 p-4 bg-secondary dark:bg-secondary-dark rounded-md shadow-md">

          <View className="mt-4">
            <CustomText className="font-semibold mb-2">Horários Disponíveis</CustomText>
            {periods.map((period, index) => (
              <View key={index} className="flex-row items-center justify-between py-1">
                <CustomText>{`${traduzirDiaDaSemana(period.dayOfWeek)}: ${new Date(period.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</CustomText>
                <TouchableOpacity onPress={() => removePeriod(index)} className="p-2 rounded-md bg-red-500 dark:bg-red-500">
                  <CustomText className="text-red-600">Remover</CustomText>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setIsAddingPeriod(true)}
              className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              <CustomText className="text-white">Adicionar Horário</CustomText>
            </TouchableOpacity>

            {isAddingPeriod && (
              <View className="mt-4 p-4 border rounded-md border-gray-300">
                <CustomText className="font-semibold mb-2">Adicionar Novo Horário</CustomText>
                <View className="mb-2">
                  <CustomText>Dia da Semana:</CustomText>
                  {daysOfWeek.map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      onPress={() => setSelectedDayForPeriod(day.value)}
                      className={`py-2 px-3 rounded-md ${selectedDayForPeriod === day.value ? 'bg-tertiary dark:bg-tertiary-dark' : 'bg-gray-200'} mt-1`}
                    >
                      <CustomText className={selectedDayForPeriod === day.value ? 'text-primary dark:text-primary-dark' : 'text-primary dark:text-primary-dark'}>{day.label}</CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
                <CustomDateTimePicker onDateTimeSelect={handleTimeChange} />
                <TouchableOpacity onPress={addPeriod} className="py-2 px-4 bg-green-500 text-white rounded-md">
                  <CustomText className="text-white">Salvar Horário</CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveConfiguration} className="py-3 px-6 bg-green-600 text-white rounded-md self-center">
          <CustomText className="text-white font-semibold">Salvar Configurações</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default CalendarConfigs;