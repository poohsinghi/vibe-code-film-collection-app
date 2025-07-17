import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../navigation/TabNavigator';

type FilmDetailScreenRouteProp = RouteProp<RootStackParamList, 'FilmDetail'>;

interface Props {
  route: FilmDetailScreenRouteProp;
}

export const FilmDetailScreen: React.FC<Props> = ({ route }) => {
  const { filmId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Detail</Text>
      <Text style={styles.filmId}>Film ID: {filmId}</Text>
      <Text style={styles.placeholder}>Film details will be implemented here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  filmId: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
