import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { queryKeys } from '../services/queryClient';
import { useAuthStore } from '../store/authStore';
import { WatchlistEntry } from '../store/filmStore';

// Watchlist API functions
const watchlistApi = {
  getWatchlist: async (userId: number): Promise<WatchlistEntry[]> => {
    const response = await api.get(`/watchlist/${userId}`);
    return response.data;
  },

  addToWatchlist: async (data: {
    filmId: number;
    status: 'want_to_watch' | 'watched' | 'currently_watching';
  }): Promise<WatchlistEntry> => {
    const response = await api.post('/watchlist', data);
    return response.data;
  },

  updateWatchlistEntry: async (data: {
    id: number;
    status?: string;
    rating?: number;
    review?: string;
    watchedDate?: string;
  }): Promise<WatchlistEntry> => {
    const response = await api.put(`/watchlist/${data.id}`, data);
    return response.data;
  },

  removeFromWatchlist: async (id: number): Promise<void> => {
    await api.delete(`/watchlist/${id}`);
  },
};

// Hooks
export const useWatchlist = (userId?: number) => {
  const { user } = useAuthStore();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: queryKeys.watchlist(targetUserId!),
    queryFn: () => watchlistApi.getWatchlist(targetUserId!),
    enabled: !!targetUserId,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: watchlistApi.addToWatchlist,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.watchlist(user.id),
        });
      }
    },
  });
};

export const useUpdateWatchlistEntry = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: watchlistApi.updateWatchlistEntry,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.watchlist(user.id),
        });
      }
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: watchlistApi.removeFromWatchlist,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.watchlist(user.id),
        });
      }
    },
  });
};
