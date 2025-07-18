import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { TabNavigator } from './TabNavigator';

export const MainNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};
