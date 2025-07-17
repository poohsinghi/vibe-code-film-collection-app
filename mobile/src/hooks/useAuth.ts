import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

// Auth API functions
const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    favoriteGenres?: string[];
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await api.post('/auth/refresh', { token });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },
};

// Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login: loginStore } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      loginStore(data.user, data.token);
      queryClient.clear(); // Clear all queries on login
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { login: loginStore } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      loginStore(data.user, data.token);
      queryClient.clear(); // Clear all queries on register
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear(); // Clear all queries on logout
    },
    onError: () => {
      // Even if logout fails, clear local state
      logoutStore();
      queryClient.clear();
    },
  });
};
