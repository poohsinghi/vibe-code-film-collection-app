import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecommendations } from '../../hooks/useFilms';
import { useAuthStore } from '../../store/authStore';

export const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { data: recommendations, isLoading } = useRecommendations(user?.id || 0, !!user?.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name}!</Text>
        <Text style={styles.subtitle}>Discover your next favorite film</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        ) : recommendations && recommendations.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map((film, index) => (
              <TouchableOpacity key={index} style={styles.filmCard}>
                <View style={styles.filmPoster}>
                  <Text style={styles.filmTitle}>{film.title}</Text>
                  <Text style={styles.filmYear}>{film.year}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No recommendations available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Watching</Text>
        <Text style={styles.emptyText}>No films currently watching</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  loadingText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  filmCard: {
    marginRight: 12,
    width: 120,
  },
  filmPoster: {
    height: 180,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'flex-end',
  },
  filmTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filmYear: {
    fontSize: 10,
    color: '#6b7280',
  },
});
