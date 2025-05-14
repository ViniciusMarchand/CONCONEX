import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import CustomText from './CustomText';

interface Item {
  label: string;
  value: string;
}

interface CustomPickerProps {
  label?: string;
  items: Item[];
  onSelect: (item: Item) => void;
}

const  CustomPicker: React.FC<CustomPickerProps> = ({ label, items, onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <View className="mb-4">
      {label && <CustomText className="mb-2 dark:text-gray-400 text-gray-400">{label}</CustomText>}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="border border-tertiary dark:border-tertiary-dark rounded-lg p-2 py-3"
      >
        <CustomText className="text-black">{selectedItem ? selectedItem.label : 'Selecione...'}</CustomText>
      </TouchableOpacity>
      <Modal visible={isOpen} transparent={true} animationType="fade">
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/20"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white rounded-lg p-4 w-80">
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className="p-2"
                >
                  <Text className="text-black">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomPicker;
