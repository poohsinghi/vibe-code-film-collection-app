import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  
  // Films
  films: ['films'] as const,
  film: (id: string) => ['films', id] as const,
  searchFilms: (query: string) => ['films', 'search', query] as const,
  popularFilms: ['films', 'popular'] as const,
  recommendations: (userId: number) => ['films', 'recommendations', userId] as const,
  
  // Watchlist
  watchlist: (userId: number) => ['watchlist', userId] as const,
  watchlistEntry: (userId: number, filmId: number) => ['watchlist', userId, filmId] as const,
  
  // Collections
  collections: (userId: number) => ['collections', userId] as const,
  collection: (id: number) => ['collections', id] as const,
  collectionFilms: (id: number) => ['collections', id, 'films'] as const,
  
  // User
  user: (id: number) => ['user', id] as const,
  userStats: (id: number) => ['user', id, 'stats'] as const,
} as const;
