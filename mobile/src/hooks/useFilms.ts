import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { queryKeys } from '../services/queryClient';
import { Film } from '../store/filmStore';

// Film API functions
const filmApi = {
  searchFilms: async (query: string): Promise<Film[]> => {
    const response = await api.get(`/films/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getPopularFilms: async (): Promise<Film[]> => {
    const response = await api.get('/films/popular');
    return response.data;
  },

  getFilmById: async (id: string): Promise<Film> => {
    const response = await api.get(`/films/${id}`);
    return response.data;
  },

  getRecommendations: async (userId: number): Promise<Film[]> => {
    const response = await api.get(`/films/recommendations/${userId}`);
    return response.data;
  },
};

// Hooks
export const useSearchFilms = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.searchFilms(query),
    queryFn: () => filmApi.searchFilms(query),
    enabled: enabled && query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularFilms = () => {
  return useQuery({
    queryKey: queryKeys.popularFilms,
    queryFn: filmApi.getPopularFilms,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useFilm = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.film(id),
    queryFn: () => filmApi.getFilmById(id),
    enabled: enabled && !!id,
  });
};

export const useRecommendations = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.recommendations(userId),
    queryFn: () => filmApi.getRecommendations(userId),
    enabled: enabled && !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
