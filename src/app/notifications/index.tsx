
import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notifications.api';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({
    notification,
    onPress,
}: {
    notification: Notification;
    onPress: () => void;
}) => {
    const isUnread = notification.readAt === null;
    const timeAgo = formatDistanceToNow(new Date(notification.sentAt), { addSuffix: false })
        .toUpperCase()
        .replace('ABOUT ', '')
        .replace(' AGO', '');

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`bg-[#151518] rounded-3xl p-5 border border-white/5 relative overflow-hidden ${isUnread ? 'bg-[#1a1a1f]' : ''
                }`}
        >
            {/* Unread Dot */}
            {isUnread && (
                <View className="absolute top-5 right-5 w-2 h-2 rounded-full bg-accent-purple shadow-lg" />
            )}

            <View className="flex-row gap-4">
                <View className="w-10 h-10 rounded-full bg-purple-500/10 items-center justify-center">
                    <Bell size={20} color="#c084fc" />
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-white text-lg font-sans-bold flex-1 pr-4">
                            {notification.title}
                        </Text>
                    </View>
                    <Text className="text-xs text-zinc-500 font-sans-bold leading-5 mb-4 pr-4">
                        {notification.body}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <ClockIcon />
                        <Text className="text-zinc-600 text-xs font-sans-bold uppercase tracking-wider">
                            {timeAgo}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const EmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
        <View className="w-16 h-16 rounded-full bg-zinc-800 items-center justify-center mb-4">
            <BellOff size={32} color="#71717a" />
        </View>
        <Text className="text-white text-lg font-sans-bold mb-2">No notifications</Text>
        <Text className="text-zinc-500 text-sm font-sans-medium text-center px-8">
            You're all caught up! New notifications will appear here.
        </Text>
    </View>
);

const LoadingSkeleton = () => (
    <View className="gap-4">
        {[1, 2, 3].map((i) => (
            <View key={i} className="bg-[#151518] rounded-3xl p-5 border border-white/5">
                <View className="flex-row gap-4">
                    <View className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                    <View className="flex-1">
                        <View className="h-5 bg-zinc-800 rounded w-3/4 mb-3 animate-pulse" />
                        <View className="h-3 bg-zinc-800 rounded w-full mb-2 animate-pulse" />
                        <View className="h-3 bg-zinc-800 rounded w-2/3 animate-pulse" />
                    </View>
                </View>
            </View>
        ))}
    </View>
);

export default function NotificationsScreen() {
    const router = useRouter();
    const {
        notifications,
        isLoading,
        isFetching,
        markAsRead,
        markAllAsRead,
        isMarkingAllAsRead,
        refetch,
    } = useNotifications();

    const hasUnread = notifications.some((n) => n.readAt === null);

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read if unread
        if (notification.readAt === null) {
            markAsRead(notification.id);
        }
        // Optionally navigate to the reminder
        if (notification.reminderId) {
            router.push(`/reminders/${notification.reminderId}`);
        }
    };

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

                    {hasUnread && (
                        <TouchableOpacity
                            onPress={markAllAsRead}
                            disabled={isMarkingAllAsRead}
                        >
                            {isMarkingAllAsRead ? (
                                <ActivityIndicator size="small" color="#8B5CF6" />
                            ) : (
                                <Text className="text-accent-purple font-sans-bold text-xs tracking-wider uppercase">
                                    Mark all as read
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isFetching && !isLoading}
                            onRefresh={refetch}
                            tintColor="#8B5CF6"
                        />
                    }
                >
                    <View className="mb-6">
                        <Text className="text-white text-large font-sans-bold mb-2">Notifications</Text>
                        <Text className="text-zinc-500 font-sans-bold text-sm">
                            Stay updated with your schedule
                        </Text>
                    </View>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : notifications.length === 0 ? (
                        <EmptyState />
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onPress={() => handleNotificationPress(notification)}
                            />
                        ))
                    )}
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

