import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Shield,
  User as UserIcon,
} from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { LargeSettingsItem } from '@/components/LargeSettingsItem';
import { PlanCard } from '@/components/PlanCard';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/constants/layout';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-bg-primary">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{
          ...Layout.tabBarAwareContent,
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <View className="items-start mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="items-center mb-10">
          <View className="mb-6 relative">
            {/* Avatar Container */}
            <View className="w-32 h-32 rounded-[40px] border-4 border-bg-primary overflow-hidden bg-[#6ccf59] items-center justify-center shadow-2xl">
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-xlarge text-white font-sans-medium mt-1">
                  {user?.displayName?.[0]?.toUpperCase() || 'S'}
                </Text>
              )}
            </View>
          </View>

          <Text variant="h2" weight="extrabold" className="text-white tracking-tighter mb-1 text-center">
            {user?.displayName || 'User'}
          </Text>

          <Text variant="micro" className="text-text-muted opacity-60 tracking-[2px]">
            MEMBER SINCE {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : 'JAN 2026'}
          </Text>
        </View>

        {/* PlanCard */}
        <PlanCard onPress={() => router.push('/settings/plans-billing')} />

        {/* Account Settings */}
        <View>
          <Text variant="micro" className="text-text-dim mb-4 pl-2 tracking-[2px]">
            ACCOUNT SETTINGS
          </Text>

          <LargeSettingsItem
            icon={UserIcon}
            title="Profile Info"
            subtitle="Details & Identity"
            iconColor="#60a5fa"
            iconFill="#60a5fa"
            onPress={() => router.push('/settings/profile')}
          />

          <LargeSettingsItem
            icon={Bell}
            title="Notifications"
            subtitle="Schedules & Sounds"
            iconColor="#facc15"
            iconFill="#facc15"
            onPress={() => router.push('/settings/notifications')}
          />

          <LargeSettingsItem
            icon={Shield}
            title="Security"
            subtitle="Privacy & Access"
            iconColor="#94a3b8"
            iconFill="#94a3b8"
            onPress={() => router.push('/settings/security')}
          />

        </View>
      </ScrollView>
    </View>
  );
}
