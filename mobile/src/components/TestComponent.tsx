import React from 'react';
import { Text, View } from 'react-native';

export const TestComponent: React.FC = () => {
  return (
    <View className="p-4 bg-blue-500 rounded-lg">
      <Text className="text-white text-lg font-bold">
        NativeWind Test Component
      </Text>
      <Text className="text-blue-100 text-sm mt-2">
        If you can see this styled correctly, NativeWind is working!
      </Text>
    </View>
  );
};
