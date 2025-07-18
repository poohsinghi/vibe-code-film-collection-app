import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useAuthStore } from '../../store/authStore';

export const WatchlistScreen: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'want_to_watch' | 'watched' | 'currently_watching'>('all');
  const { user } = useAuthStore();
  const { data: watchlist, isLoading, error } = useWatchlist(user?.id);

  const filteredWatchlist = watchlist?.filter(item => 
    filter === 'all' || item.status === filter
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watched':
        return '#10b981';
      case 'currently_watching':
        return '#f59e0b';
      case 'want_to_watch':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'watched':
        return 'Watched';
      case 'currently_watching':
        return 'Watching';
      case 'want_to_watch':
        return 'Want to Watch';
      default:
        return status;
    }
  };

  const renderWatchlistItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="w-16 h-20 bg-gray-200 rounded-lg items-center justify-center mr-3">
        <Text className="text-2xl">🎬</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {item.film?.title || 'Unknown Title'}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">{item.film?.year}</Text>
        <View className="flex-row">
          <View 
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            <Text className="text-white text-xs font-medium">
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        {item.userRating && (
          <Text className="text-sm text-gray-600 mt-1">Rating: {item.userRating}/10</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filterType: typeof filter, label: string) => (
    <TouchableOpacity
      className={`px-3 py-2 rounded-full border ${
        filter === filterType 
          ? 'bg-blue-500 border-blue-500' 
          : 'bg-white border-gray-300'
      }`}
      onPress={() => setFilter(filterType)}
    >
      <Text className={`text-sm font-medium ${
        filter === filterType ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">Loading watchlist...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">Error loading watchlist</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">My Watchlist</Text>
        <View className="flex-row space-x-2">
          {renderFilterButton('all', 'All')}
          {renderFilterButton('want_to_watch', 'Want to Watch')}
          {renderFilterButton('currently_watching', 'Watching')}
          {renderFilterButton('watched', 'Watched')}
        </View>
      </View>

      {filteredWatchlist.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-gray-500 text-center text-base">
            {filter === 'all' 
              ? 'Your watchlist is empty. Start adding some films!'
              : `No films in ${getStatusText(filter)} category`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWatchlist}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id.toString()}
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
};


