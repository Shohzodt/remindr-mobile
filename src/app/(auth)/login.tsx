import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { RemindrLogo } from '@/components/ui/RemindrLogo';
import { Theme } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Linking from 'expo-linking';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { loginWithGoogle, loginWithTelegram } = useAuth();

  // ... (keeping existing hooks) ...
  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        loginWithGoogle(id_token);
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  // Use the custom hook for Telegram Auth
  const { initiateTelegramLogin, isLoading: isTelegramLoading } = useTelegramAuth();

  const handleTelegramLogin = async () => {
    await initiateTelegramLogin();
  };


  return (
    <View className="flex-1 bg-bg-primary overflow-hidden min-h-screen">
      {/* Background Glow */}
      <View className="absolute -top-[20%] -left-[40%] w-[500px] h-[500px] pointer-events-none">
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0" stopColor="#8B5CF6" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
        </Svg>
      </View>

      {/* Background Glow Bottom Right */}
      <View className="absolute -bottom-[10%] -right-[10%] w-72 h-72 pointer-events-none">
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="grad-br"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0" stopColor="#d946ef" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#d946ef" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad-br)" />
        </Svg>
      </View>

      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 pt-20 pb-12 justify-between">
          {/* Logo Section */}
          <View className="flex-1 items-center justify-center mb-12">
            <RemindrLogo size={160} style={{ marginBottom: 24 }} />
            <Text className="text-xlarge font-extrabold text-text-primary tracking-tighter mb-3 mt-6">
              Remind
              <Text className="text-accent-fuchsia">r</Text>
            </Text>
            <Text className="text-lg text-text-secondary mb-2 font-medium">Manage what matters.</Text>
            <Text className="text-xs text-text-secondary text-center leading-5">
              Smart reminders, AI-powered contract analysis, and{'\n'} important life events — all in one.
            </Text>
          </View>

          {/* Buttons Section */}
          <View className="w-full gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-center h-16 rounded-3xl w-full bg-white active:opacity-80"
              onPress={handleGoogleLogin}
              disabled={!request}
              activeOpacity={0.8}
            >
              <AntDesign name="google" size={24} color="black" style={{ marginRight: 12 }} />
              <Text className="text-base font-bold text-black">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center h-16 rounded-3xl w-full bg-[#2AABEE] active:opacity-80"
              onPress={handleTelegramLogin}
              activeOpacity={0.8}
            >
              <FontAwesome name="telegram" size={24} color="white" style={{ marginRight: 12 }} />
              <Text className="text-base font-bold text-white">Continue with Telegram</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center mt-12">
            <Text className="text-[#444] text-[11px] font-bold tracking-[1px] mb-1">BY SIGNING IN, YOU AGREE TO OUR</Text>
            <Text className="text-text-secondary text-[11px] font-bold tracking-[1.5px]">
              TERMS OF SERVICE
              <Text className="text-[#52525c] text-[10px] font-extrabold tracking-[1px]"> & </Text>
              <Text className="text-text-secondary">PRIVACY POLICY</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
