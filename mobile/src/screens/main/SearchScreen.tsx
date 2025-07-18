import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearchFilms } from "../../hooks/useFilms";
import { useAuthStore } from "../../store/authStore";
import { Film, useFilmStore } from "../../store/filmStore";

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const { searchResults, setSearchResults } = useFilmStore();
  const { isAuthenticated } = useAuthStore();

  const { data: filmsRes, isLoading, error } = useSearchFilms(searchTrigger, searchTrigger.length > 0);

  React.useEffect(() => {
    if (filmsRes) {
      setSearchResults(filmsRes.films);
    }
  }, [filmsRes, setSearchResults]);

  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setSearchTrigger(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchTrigger("");
    setSearchResults([]);
  };

  const handleAddToWatchlist = (film: any) => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to add films to your watchlist", [{ text: "OK" }]);
      return;
    }
    // Add to watchlist logic here
  };

  const renderFilmItem = ({ item }: { item: Film }) => {
    return (
      <View className=" bg-white rounded-lg p-4 mb-3 shadow-sm  w-full">
        <View className="w-16 h-20  rounded-lg items-center justify-center mr-3">
          <Text className="text-2xl">📽️</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">{item.title}</Text>
          <Text className="text-sm text-gray-600 mb-1">{item.year}</Text>
          <Text className="text-sm text-gray-500">{item.genre}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row gap-2">
          <View className="flex-1 relative">
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base pr-10"
              placeholder="Search for films..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {(searchQuery.length > 0 || searchTrigger.length > 0) && (
              <TouchableOpacity
                className="absolute right-2 top-3 w-6 h-6 bg-gray-400 rounded-full items-center justify-center"
                onPress={handleClearSearch}
              >
                <Text className="text-white text-xs font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            className={`px-4 py-3 rounded-lg justify-center items-center min-w-[70px] ${
              searchQuery.trim().length > 2 ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={handleSearch}
            disabled={searchQuery.trim().length <= 2}
          >
            <Text className={`font-semibold ${searchQuery.trim().length > 2 ? "text-white" : "text-gray-500"}`}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600">Searching films...</Text>
        </View>
      )}

      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-center">Error searching films</Text>
        </View>
      )}

      {!isLoading && !error && searchTrigger.length > 0 && searchResults.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-center">No films found for "{searchTrigger}"</Text>
        </View>
      )}

      {!isLoading && (
        <FlatList
          data={searchResults}
          renderItem={renderFilmItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}

      {searchTrigger.length === 0 && (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-4xl mb-4">🎬</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">Search for Films</Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Enter a film title and press the Search button
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
