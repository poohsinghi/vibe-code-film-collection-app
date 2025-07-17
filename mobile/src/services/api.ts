import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';

// Get the base URL from environment or use localhost for development
const getBaseURL = () => {
  if (__DEV__) {
    // For development with Docker, use localhost
    // For physical device testing, replace localhost with your computer's IP address
    // e.g., 'http://192.168.1.100:3000/api'
    return 'http://localhost:3000/api';
  }
  // For production, use your production API URL
  return Constants.expoConfig?.extra?.apiUrl || 'https://your-api.com/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, logout user
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
