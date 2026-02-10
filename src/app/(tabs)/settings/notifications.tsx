import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Layout } from "@/constants/layout";
import { Text } from '@/components/ui/Text';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

// Custom Toggle Component (Disabled version)
const CustomToggle = ({ active, disabled = false }: { active: boolean, disabled?: boolean }) => {
    return (
        <View
            className={`w-12 h-6 rounded-full justify-center ${active ? 'bg-[#8B5CF6]' : 'bg-zinc-800'} ${disabled ? 'opacity-40' : ''}`}
        >
            <View
                className={`w-4 h-4 bg-white rounded-full absolute top-1 ${active ? 'right-1' : 'left-1'}`}
            />
        </View>
    );
};

// Row Component (Disabled)
const SettingRow = ({ title, description, active }: { title: string, description: string, active: boolean }) => (
    <View className="p-6 flex-row items-center justify-between opacity-50">
        <View className="flex-1 pr-4">
            <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">
                {title}
            </Text>
            <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>
                {description}
            </Text>
        </View>
        <CustomToggle active={active} disabled />
    </View>
);

export default function NotificationsSettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { advanceWarningMinutes, setAdvanceWarningMinutes, isLoading, isSaving, error, options } = useNotificationSettings();

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    ...Layout.tabBarAwareContent,
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center gap-6 mb-12">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text variant="h2" weight="extrabold" className="text-white tracking-tighter">
                        Notifications
                    </Text>
                    {isSaving && <ActivityIndicator size="small" color="#8B5CF6" />}
                </View>

                {isLoading ? (
                    <LoadingSpinner message="Loading settings..." />
                ) : (
                    <View className="gap-10">
                        {/* Error Message */}
                        {error && (
                            <View className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                                <Text className="text-red-400 text-sm text-center">{error}</Text>
                            </View>
                        )}

                        {/* Delivery Channels (Disabled) */}
                        <View className="opacity-50">
                            <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                                Delivery Channels
                            </Text>
                            <View className="bg-[#121217] rounded-[32px] border border-white/5 overflow-hidden">
                                <SettingRow
                                    title="Push Notifications"
                                    description="Real-time alerts on this device"
                                    active={true}
                                />
                                <View className="h-[1px] bg-white/5 mx-6" />
                                <SettingRow
                                    title="Email Digests"
                                    description="Weekly schedule summaries"
                                    active={false}
                                />
                            </View>
                        </View>

                        {/* Timing Preferences */}
                        <View>
                            <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                                Timing Preferences
                            </Text>
                            <View className="bg-[#121217] rounded-[32px] border border-white/5 p-6 gap-8">
                                {/* Advance Warning Pills - INTERACTIVE */}
                                <View>
                                    <Text variant="caption" weight="bold" className="text-zinc-400 mb-4">
                                        Advance Warning
                                    </Text>
                                    <View className="flex-row gap-2 flex-wrap">
                                        {options.map(option => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => setAdvanceWarningMinutes(option.value)}
                                                disabled={isSaving}
                                                className={`px-5 py-2.5 rounded-xl border ${advanceWarningMinutes === option.value
                                                    ? 'bg-[#8B5CF6] border-transparent shadow-sm'
                                                    : 'bg-white/5 border-white/5'
                                                    } ${isSaving ? 'opacity-50' : ''}`}
                                            >
                                                <Text variant="micro" weight="extrabold" className={`${advanceWarningMinutes === option.value ? 'text-white' : 'text-zinc-500'} tracking-widest`}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Critical Reminders (Disabled) */}
                                <View className="flex-row items-center justify-between opacity-50">
                                    <View className="flex-1 pr-4">
                                        <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Critical Reminders</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>High-priority sound for deadlines</Text>
                                    </View>
                                    <CustomToggle active={true} disabled />
                                </View>

                                {/* Auto Follow-up (Disabled) */}
                                <View className="flex-row items-center justify-between opacity-50">
                                    <View className="flex-1 pr-4">
                                        <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Auto Follow-up</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>Re-alert if not dismissed in 30m</Text>
                                    </View>
                                    <CustomToggle active={false} disabled />
                                </View>
                            </View>
                        </View>

                        {/* Quiet Hours (Disabled) */}
                        <View className="opacity-50">
                            <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                                Quiet Hours
                            </Text>
                            <View className="bg-[#121217] rounded-[32px] border border-white/5 p-6 gap-6">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1 pr-4">
                                        <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Enable Quiet Hours</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>Mute non-critical notifications</Text>
                                    </View>
                                    <CustomToggle active={false} disabled />
                                </View>
                            </View>
                        </View>

                        {/* Sensory (Disabled) */}
                        <View className="opacity-50">
                            <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                                Sensory
                            </Text>
                            <View className="bg-[#121217] rounded-[32px] border border-white/5 overflow-hidden">
                                <SettingRow
                                    title="Alert Sound"
                                    description="Remindr signature chime"
                                    active={true}
                                />
                                <View className="h-[1px] bg-white/5 mx-6" />
                                <SettingRow
                                    title="Haptic Feedback"
                                    description="Subtle vibrations on alert"
                                    active={true}
                                />
                            </View>
                        </View>

                        {/* Confirm Settings Button (Disabled) */}
                        <TouchableOpacity
                            activeOpacity={1}
                            className="w-full h-16 mb-12 opacity-40"
                            disabled
                        >
                            <LinearGradient
                                colors={['#3f3f46', '#27272a']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    flex: 1,
                                    borderRadius: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text className="text-zinc-500 font-sans-extrabold text-base tracking-wide">
                                    Confirm Settings
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                )}
            </ScrollView>
        </View>
    );
}
