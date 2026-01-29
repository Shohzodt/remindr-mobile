
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { ArrowLeft, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data matching the design
const NOTIFICATIONS = [
    {
        id: '1',
        type: 'warning',
        title: 'Contract Renewal',
        description: 'Your Adobe Creative Cloud subscription ends in 3 days. Review now to avoid service interruption.',
        time: '2M AGO',
        unread: true,
    },
    {
        id: '2',
        type: 'info',
        title: 'Upcoming Event',
        description: 'Design Critique starts in 15 minutes. Join via Google Meet.',
        time: '12M AGO',
        unread: true,
    },
    {
        id: '3',
        type: 'success',
        title: 'Goal Achieved',
        description: 'You completed all your scheduled sports events this week! Keep it up.',
        time: '2H AGO',
        unread: false,
    },
    {
        id: '4',
        type: 'alert',
        title: 'Security Alert',
        description: 'A new login was detected on a MacBook Pro in London, UK.',
        time: 'YESTERDAY',
        unread: false,
    },
];

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'warning':
            return (
                <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center">
                    <AlertTriangle size={20} color="#ef4444" />
                </View>
            );
        case 'info':
            return (
                <View className="w-10 h-10 rounded-full bg-purple-500/10 items-center justify-center">
                    <Info size={20} color="#c084fc" />
                </View>
            );
        case 'success':
            return (
                <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center">
                    <CheckCircle size={20} color="#22c55e" />
                </View>
            );
        case 'alert':
            return (
                <View className="w-10 h-10 rounded-full bg-amber-500/10 items-center justify-center">
                    <ShieldAlert size={20} color="#f59e0b" />
                </View>
            );
        default:
            return null;
    }
};

export default function NotificationsScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#050505]">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text className="text-accent-purple font-sans-bold text-xs tracking-wider uppercase">Mark all as read</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6" contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
                    <View className="mb-6">
                        <Text className="text-white text-large font-sans-bold mb-2">Notifications</Text>
                        <Text className="text-zinc-500 font-sans-bold text-sm">Stay updated with your schedule</Text>
                    </View>

                    {NOTIFICATIONS.map((item) => (
                        <View
                            key={item.id}
                            className="bg-[#151518] rounded-3xl p-5 border border-white/5 relative overflow-hidden"
                        >
                            {/* Unread Dot */}
                            {item.unread && (
                                <View className="absolute top-5 right-5 w-2 h-2 rounded-full bg-accent-purple shadow-lg" />
                            )}

                            <View className="flex-row gap-4">
                                <NotificationIcon type={item.type} />
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start mb-1">
                                        <Text className="text-white text-lg font-sans-bold">{item.title}</Text>
                                    </View>
                                    <Text className="text-xs text-zinc-500 font-sans-bold leading-5 mb-4 pr-4">
                                        {item.description}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <ClockIcon />
                                        <Text className="text-zinc-600 text-xs font-sans-bold uppercase tracking-wider">{item.time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const ClockIcon = () => (
    <View className="w-3 h-3 rounded-full border border-zinc-600 items-center justify-center opacity-70">
        <View className="w-[1px] h-1 bg-zinc-600 mb-[1px]" />
    </View>
);
