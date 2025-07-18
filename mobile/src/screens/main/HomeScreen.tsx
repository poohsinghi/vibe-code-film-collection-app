import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

// Mock daily film suggestions (you can replace this with actual API data)
const dailySuggestions = [
  { id: '1', title: 'The Shawshank Redemption', year: '1994', rating: '9.3', poster: 'https://via.placeholder.com/300x450' },
  { id: '2', title: 'The Godfather', year: '1972', rating: '9.2', poster: 'https://via.placeholder.com/300x450' },
  { id: '3', title: 'Pulp Fiction', year: '1994', rating: '8.9', poster: 'https://via.placeholder.com/300x450' },
  { id: '4', title: 'The Dark Knight', year: '2008', rating: '9.0', poster: 'https://via.placeholder.com/300x450' },
  { id: '5', title: 'Forrest Gump', year: '1994', rating: '8.8', poster: 'https://via.placeholder.com/300x450' },
  { id: '6', title: 'Inception', year: '2010', rating: '8.7', poster: 'https://via.placeholder.com/300x450' },
  { id: '7', title: 'The Matrix', year: '1999', rating: '8.7', poster: 'https://via.placeholder.com/300x450' },
  { id: '8', title: 'Goodfellas', year: '1990', rating: '8.7', poster: 'https://via.placeholder.com/300x450' },
];

export const HomeScreen: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const renderFilmCard = ({ item }: { item: typeof dailySuggestions[0] }) => (
    <TouchableOpacity className="bg-white rounded-xl mb-4 shadow-sm" style={{ width: cardWidth }}>
      <Image 
        source={{ uri: item.poster }} 
        className="w-full rounded-t-xl bg-gray-200" 
        style={{ height: cardWidth * 1.5 }}
      />
      <View className="p-3">
        <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">{item.year}</Text>
        <View className="flex-row items-center">
          <Text className="text-sm font-medium text-yellow-600">⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-5 bg-blue-500">
          <Text className="text-2xl font-bold text-white mb-1">
            {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Welcome to Film Collection'}
          </Text>
          <Text className="text-base text-blue-100">Discover amazing films every day</Text>
        </View>

        <View className="p-5 pb-2">
          <Text className="text-xl font-bold text-gray-900 mb-1">Daily Film Suggestions</Text>
          <Text className="text-base text-gray-600">Handpicked films for you today</Text>
        </View>

        <FlatList
          data={dailySuggestions}
          renderItem={renderFilmCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          scrollEnabled={false}
        />

        {!isAuthenticated && (
          <View className="m-5 p-6 bg-white rounded-xl items-center shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              Want to save your favorites?
            </Text>
            <Text className="text-base text-gray-600 text-center mb-5 leading-6">
              Login to create your personal watchlist and get personalized recommendations
            </Text>
            <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
              <Text className="text-white text-base font-semibold">Get Started</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
