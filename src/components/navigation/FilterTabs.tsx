import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface Tab {
  label: string;
  value: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex px-3"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          onPress={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-full mr-2 ${
        activeTab === tab.value ? 'bg-secondary-600' : 'bg-gray-200'
      }`}
        >
          <View>
            <Text
              className={`font-semibold text-base ${
                activeTab === tab.value ? 'text-white' : 'text-gray-700'
              }`}
            >
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
