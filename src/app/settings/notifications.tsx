import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

import { Theme } from "@/theme";
import { Layout } from "@/constants/layout";
import { Text } from '@/components/ui/Text';

// Custom Toggle Component to match Web Design specific look
const CustomToggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => {
    // We can use a simple view animation or just conditional styling. 
    // Web uses: w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#8B5CF6]' : 'bg-zinc-800'}
    // Circle: absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-7' : 'translate-x-1'}

    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            className={`w-12 h-6 rounded-full justify-center ${active ? 'bg-[#8B5CF6]' : 'bg-zinc-800'}`}
        >
            <View
                className={`w-4 h-4 bg-white rounded-full absolute top-1 ${active ? 'right-1' : 'left-1'}`}
            />
        </TouchableOpacity>
    );
};

// Row Component
const SettingRow = ({ title, description, active, onToggle }: { title: string, description: string, active: boolean, onToggle: () => void }) => (
    <View className="p-6 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
            <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">
                {title}
            </Text>
            <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>
                {description}
            </Text>
        </View>
        <CustomToggle active={active} onToggle={onToggle} />
    </View>
);

export default function NotificationsSettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [channels, setChannels] = useState({ push: true, email: false });
    const [advanceAlert, setAdvanceAlert] = useState('15m');
    const [critical, setCritical] = useState(true);
    const [followUp, setFollowUp] = useState(false);
    const [quietHours, setQuietHours] = useState(false);
    const [sensory, setSensory] = useState({ sound: true, haptics: true });

    const advanceOptions = ['None', '5m', '15m', '1h', '1d'];

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
                </View>

                <View className="gap-10">
                    {/* Delivery Channels */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Delivery Channels
                        </Text>
                        <View className="bg-[#121217] rounded-[32px] border border-white/5 overflow-hidden">
                            <SettingRow
                                title="Push Notifications"
                                description="Real-time alerts on this device"
                                active={channels.push}
                                onToggle={() => setChannels(prev => ({ ...prev, push: !prev.push }))}
                            />
                            <View className="h-[1px] bg-white/5 mx-6" />
                            <SettingRow
                                title="Email Digests"
                                description="Weekly schedule summaries"
                                active={channels.email}
                                onToggle={() => setChannels(prev => ({ ...prev, email: !prev.email }))}
                            />
                        </View>
                    </View>

                    {/* Timing Preferences */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Timing Preferences
                        </Text>
                        <View className="bg-[#121217] rounded-[32px] border border-white/5 p-6 gap-8">
                            {/* Advance Warning Pills */}
                            <View>
                                <Text variant="caption" weight="bold" className="text-zinc-400 mb-4">
                                    Advance Warning
                                </Text>
                                <View className="flex-row gap-2">
                                    {/* Horizontal Scroll if needed, but pills are small enough to wrap or fit */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                                        {advanceOptions.map(time => (
                                            <TouchableOpacity
                                                key={time}
                                                onPress={() => setAdvanceAlert(time)}
                                                className={`px-5 py-2.5 rounded-xl border mr-2 ${advanceAlert === time
                                                    ? 'bg-[#8B5CF6] border-transparent shadow-sm'
                                                    : 'bg-white/5 border-white/5'
                                                    }`}
                                            >
                                                <Text variant="micro" weight="extrabold" className={`${advanceAlert === time ? 'text-white' : 'text-zinc-500'} tracking-widest`}>
                                                    {time}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 pr-4">
                                    <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Critical Reminders</Text>
                                    <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>High-priority sound for deadlines</Text>
                                </View>
                                <CustomToggle active={critical} onToggle={() => setCritical(!critical)} />
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 pr-4">
                                    <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Auto Follow-up</Text>
                                    <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>Re-alert if not dismissed in 30m</Text>
                                </View>
                                <CustomToggle active={followUp} onToggle={() => setFollowUp(!followUp)} />
                            </View>
                        </View>
                    </View>

                    {/* Quiet Hours */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Quiet Hours
                        </Text>
                        <View className="bg-[#121217] rounded-[32px] border border-white/5 p-6 gap-6">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 pr-4">
                                    <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Enable Quiet Hours</Text>
                                    <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>Mute non-critical notifications</Text>
                                </View>
                                <CustomToggle active={quietHours} onToggle={() => setQuietHours(!quietHours)} />
                            </View>

                            {quietHours && (
                                <View className="pt-4 border-t border-white/5 flex-row gap-4">
                                    <View className="flex-1">
                                        <Text variant="micro" className="text-zinc-600 mb-2 tracking-widest">FROM</Text>
                                        <View className="bg-white/5 p-3 rounded-xl border border-white/10 items-center">
                                            <Text variant="body" weight="bold" className="text-white text-sm">22:00</Text>
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text variant="micro" className="text-zinc-600 mb-2 tracking-widest">TO</Text>
                                        <View className="bg-white/5 p-3 rounded-xl border border-white/10 items-center">
                                            <Text variant="body" weight="bold" className="text-white text-sm">07:00</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Sensory */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Sensory
                        </Text>
                        <View className="bg-[#121217] rounded-[32px] border border-white/5 overflow-hidden">
                            <SettingRow
                                title="Alert Sound"
                                description="Remindr signature chime"
                                active={sensory.sound}
                                onToggle={() => setSensory(prev => ({ ...prev, sound: !prev.sound }))}
                            />
                            <View className="h-[1px] bg-white/5 mx-6" />
                            <SettingRow
                                title="Haptic Feedback"
                                description="Subtle vibrations on alert"
                                active={sensory.haptics}
                                onToggle={() => setSensory(prev => ({ ...prev, haptics: !prev.haptics }))}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="w-full h-16 mb-12"
                    >
                        <LinearGradient
                            colors={['#9333ea', '#ec4899']}
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
                            <Text className="text-white font-sans-extrabold text-base tracking-wide">
                                Confirm Settings
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}
