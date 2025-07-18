import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegister } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
  const registerMutation = useRegister();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6 py-8">
          <View className="bg-white rounded-lg p-6 shadow-lg">
            <Text className="text-3xl font-bold text-center mb-8 text-gray-900">
              Create Account
            </Text>
            
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 text-base">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 text-base">Confirm Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className={`bg-blue-500 rounded-lg py-3 mb-4 ${registerMutation.isPending ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={registerMutation.isPending}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="py-2"
            >
              <Text className="text-blue-500 text-center text-base">
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
