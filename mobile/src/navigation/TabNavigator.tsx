import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { FilmDetailScreen } from '../screens/main/FilmDetailScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SearchScreen } from '../screens/main/SearchScreen';
import { WatchlistScreen } from '../screens/main/WatchlistScreen';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  WatchlistTab: undefined;
  ProfileTab: undefined;
  LoginTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  FilmDetail: { filmId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'WatchlistTab') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'LoginTab') {
            iconName = isAuthenticated ? 'log-out' : 'log-in';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      {isAuthenticated ? (
        <>
          <Tab.Screen 
            name="WatchlistTab" 
            component={WatchlistScreen}
            options={{ tabBarLabel: 'Watchlist' }}
          />
          <Tab.Screen 
            name="ProfileTab" 
            component={ProfileScreen}
            options={{ tabBarLabel: 'Profile' }}
          />
        </>
      ) : (
        <Tab.Screen 
          name="LoginTab" 
          component={AuthNavigator}
          options={{ tabBarLabel: 'Login' }}
        />
      )}
    </Tab.Navigator>
  );
};

export const TabNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="FilmDetail" 
        component={FilmDetailScreen}
        options={{ 
          headerShown: true,
          headerTitle: 'Film Details',
        }}
      />
    </Stack.Navigator>
  );
};
