import React from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogout } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="bg-white mx-4 mb-4 rounded-lg p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-center py-2">
      <Text className="text-gray-600 font-medium">{label}</Text>
      <Text className="text-gray-900">{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-white pt-8 pb-6 px-4 items-center border-b border-gray-200">
          <View className="mb-4">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text className="text-xl font-bold text-gray-900">{user?.name}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>

      <ProfileSection title="Account Information">
        <ProfileItem label="Name" value={user?.name || 'N/A'} />
        <ProfileItem label="Email" value={user?.email || 'N/A'} />
        <ProfileItem 
          label="Member Since" 
          value={new Date().toLocaleDateString()} // This should come from user.createdAt
        />
      </ProfileSection>

        <ProfileSection title="Preferences">
          <View className="py-2">
            <Text className="text-gray-600 font-medium mb-2">Favorite Genres</Text>
            <View className="flex-row flex-wrap gap-2">
              {user?.favoriteGenres && user.favoriteGenres.length > 0 ? (
                user.favoriteGenres.map((genre, index) => (
                  <View key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-800 text-sm font-medium">{genre}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-900">None selected</Text>
              )}
            </View>
          </View>
        </ProfileSection>

        <ProfileSection title="Statistics">
          <ProfileItem label="Films Watched" value="0" />
          <ProfileItem label="Hours Watched" value="0" />
          <ProfileItem label="Average Rating" value="N/A" />
        </ProfileSection>

        <View className="mx-4 mb-8">
          <TouchableOpacity className="bg-blue-500 py-3 px-4 rounded-lg mb-3">
            <Text className="text-white text-center font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-gray-100 py-3 px-4 rounded-lg mb-3">
            <Text className="text-gray-700 text-center font-semibold">Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-red-500 py-3 px-4 rounded-lg"
            onPress={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <Text className="text-white text-center font-semibold">
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
