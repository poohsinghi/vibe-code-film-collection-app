import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSearchFilms } from '../../hooks/useFilms';
import { useFilmStore } from '../../store/filmStore';

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, setSearchResults } = useFilmStore();
  
  const { data: films, isLoading, error } = useSearchFilms(searchQuery, searchQuery.length > 2);

  React.useEffect(() => {
    if (films) {
      setSearchResults(films);
    }
  }, [films, setSearchResults]);

  const renderFilmItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.filmItem}>
      <View style={styles.filmPoster}>
        <Text style={styles.posterPlaceholder}>📽️</Text>
      </View>
      <View style={styles.filmInfo}>
        <Text style={styles.filmTitle}>{item.title}</Text>
        <Text style={styles.filmYear}>{item.year}</Text>
        <Text style={styles.filmGenre}>{item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for films..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Searching films...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error searching films</Text>
        </View>
      )}

      {!isLoading && !error && searchQuery.length > 2 && searchResults.length === 0 && (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No films found</Text>
        </View>
      )}

      {!isLoading && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderFilmItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          style={styles.filmList}
        />
      )}

      {searchQuery.length <= 2 && (
        <View style={styles.centerContainer}>
          <Text style={styles.instructionText}>
            Type at least 3 characters to search for films
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  instructionText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  filmList: {
    flex: 1,
  },
  filmItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filmPoster: {
    width: 60,
    height: 90,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  posterPlaceholder: {
    fontSize: 24,
  },
  filmInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  filmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  filmYear: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  filmGenre: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
