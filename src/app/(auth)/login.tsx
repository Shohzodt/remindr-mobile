import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  // Telegram - navigate to OTP screen with telegram mode
  const handleTelegramLogin = () => {
    router.push('/(auth)/otp?source=telegram');
  };

  return (
    <View className="flex-1 bg-bg-primary overflow-hidden min-h-screen">
      {/* Background Glow */}
      <View className="absolute -top-[20%] -left-[40%] w-[500px] h-[500px] pointer-events-none">
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0" stopColor="#8B5CF6" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad)" />
        </Svg>
      </View>

      <View className="absolute -bottom-[10%] -right-[10%] w-72 h-72 pointer-events-none">
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="grad-br" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0" stopColor="#d946ef" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#d946ef" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#grad-br)" />
        </Svg>
      </View>

      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 pt-10 pb-8 justify-between">

          <View className="flex-1 justify-center items-center">
            <View
              style={{
                backgroundColor: '#0B0B0F',
                borderRadius: 48,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Image
                source={require('../../../assets/icon.png')}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 48,
                }}
                resizeMode="cover"
              />
            </View>
            <Text className="text-xlarge font-extrabold text-text-primary tracking-tighter mb-2">
              Remind<Text className="text-accent-fuchsia">r</Text>
            </Text>
            <Text className="text-lg text-text-secondary mb-2 font-medium">Manage what matters.</Text>
            <Text className="mb-8 text-xs text-text-secondary text-center leading-5">
              Smart reminders, AI-powered contract analysis, and{'\n'} important life events — all in one.
            </Text>
          </View>


          {/* Main Auth Flow */}
          <View className="w-full mb-8">
            <TouchableOpacity
              className="flex-row items-center justify-center h-14 rounded-2xl w-full bg-white active:opacity-80"
              onPress={() => router.push('/(auth)/otp')}
              activeOpacity={0.8}
            >
              <Ionicons name="mail" size={24} color="black" style={{ marginRight: 12 }} />
              <Text className="text-base font-bold text-black">Continue with Email</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center w-full my-4">
              <View className="flex-1 h-[1px] bg-[rgba(255,255,255,0.1)]" />
              <Text className="mx-4 text-xs text-text-secondary uppercase tracking-widest">Or</Text>
              <View className="flex-1 h-[1px] bg-[rgba(255,255,255,0.1)]" />
            </View>

            {/* Telegram Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center h-14 rounded-2xl w-full bg-[#2AABEE] active:opacity-80"
              onPress={handleTelegramLogin}
              activeOpacity={0.8}
            >
              <FontAwesome name="telegram" size={20} color="white" style={{ marginRight: 10 }} />
              <Text className="text-base font-bold text-white">Continue with Telegram</Text>
            </TouchableOpacity>
          </View>

          {/* Footer - only show on initial screen */}
          <View className="items-center mt-4">
            <Text className="text-[#444] text-[10px] font-bold tracking-[1px] mb-1">BY SIGNING IN, YOU AGREE TO OUR</Text>
            <Text className="text-text-secondary text-[10px] font-bold tracking-[1.5px]">
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
