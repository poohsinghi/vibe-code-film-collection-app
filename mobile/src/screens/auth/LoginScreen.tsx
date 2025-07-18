import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const loginMutation = useLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <View className="bg-white rounded-lg p-6 shadow-lg">
          <Text className="text-3xl font-bold text-center mb-8 text-gray-900">
            Film Collection
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 text-base">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 text-base">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`bg-blue-500 rounded-lg py-3 mb-4 ${loginMutation.isPending ? 'opacity-50' : ''}`}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="py-2"
          >
            <Text className="text-blue-500 text-center text-base">
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
