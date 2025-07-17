import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import './global.css'; // NativeWind styles
import { MainNavigator } from './src/navigation/MainNavigator';
import { queryClient } from './src/services/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
