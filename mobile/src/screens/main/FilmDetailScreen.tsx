import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/TabNavigator';

type FilmDetailScreenRouteProp = RouteProp<RootStackParamList, 'FilmDetail'>;

interface Props {
  route: FilmDetailScreenRouteProp;
}

export const FilmDetailScreen: React.FC<Props> = ({ route }) => {
  const { filmId } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Film Detail</Text>
        <Text className="text-base text-gray-600 mb-4">Film ID: {filmId}</Text>
        <Text className="text-sm text-gray-400 text-center">Film details will be implemented here</Text>
      </View>
    </SafeAreaView>
  );
};
