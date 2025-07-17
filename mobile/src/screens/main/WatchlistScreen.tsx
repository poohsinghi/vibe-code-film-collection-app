import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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
    <TouchableOpacity style={styles.watchlistItem}>
      <View style={styles.filmPoster}>
        <Text style={styles.posterPlaceholder}>🎬</Text>
      </View>
      <View style={styles.filmInfo}>
        <Text style={styles.filmTitle}>{item.film?.title || 'Unknown Title'}</Text>
        <Text style={styles.filmYear}>{item.film?.year}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        {item.userRating && (
          <Text style={styles.rating}>Rating: {item.userRating}/10</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filterType: typeof filter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading watchlist...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading watchlist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Watchlist</Text>
        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('want_to_watch', 'Want to Watch')}
          {renderFilterButton('currently_watching', 'Watching')}
          {renderFilterButton('watched', 'Watched')}
        </View>
      </View>

      {filteredWatchlist.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
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
          style={styles.watchlistList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
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
  watchlistList: {
    flex: 1,
  },
  watchlistItem: {
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
    marginBottom: 8,
  },
  statusContainer: {
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
});
