import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';
import { useReminder, useReminders } from '@/hooks/useReminders';
import { Clock, MapPin, CheckCircle, Trash2, FileText, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

export default function ReminderDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data: reminder, isLoading, error } = useReminder(id);
    const { toggleReminder, deleteReminder, isSaving } = useReminders();

    const handleDelete = () => {
        Alert.alert(
            "Delete Reminder",
            "Are you sure you want to delete this reminder?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteReminder(id!);
                        if (success) router.back();
                    }
                }
            ]
        );
    };

    const handleToggle = () => {
        if (!reminder) return;
        const newStatus = reminder.status === 'completed' ? 'active' : 'completed';
        toggleReminder(reminder.id, newStatus);
    };

    const handleShare = async () => {
        if (!reminder) return;
        try {
            await Share.share({
                message: `Reminder: ${reminder.title} at ${reminder.time} on ${reminder.date}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getCategoryStyles = (category?: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat === 'work') return 'text-purple-400';
        if (cat === 'personal') return 'text-pink-400';
        if (cat === 'social') return 'text-amber-400';
        return 'text-indigo-400';
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#050505] items-center justify-center">
                <ActivityIndicator color={Theme.colors.accentPurple} size="large" />
            </View>
        );
    }

    if (error || !reminder) {
        return (
            <View className="flex-1 bg-[#050505] items-center justify-center px-6">
                <Text variant="h3" className="text-white mb-4">Reminder not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-accent-purple font-sans-bold">Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isCompleted = reminder.status === 'completed';

    return (
        <View className="flex-1 bg-[#050505]">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-6 pt-6">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8 mt-2">
                    <View className="bg-zinc-800/50 px-4 py-1.5 rounded-full border border-white/5">
                        <Text className={`${getCategoryStyles(reminder.category)} text-xxs font-sans-bold uppercase tracking-wider`}>
                            {reminder.category || 'REMINDER'}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={handleShare}
                            className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
                        >
                            <Share2 size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleDelete}
                            className="w-10 h-10 items-center justify-center rounded-full bg-red-500/10 active:bg-red-500/20"
                        >
                            <Trash2 size={20} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Event Passed Indicator */}
                    {!isCompleted && (() => {
                        const reminderDate = new Date(`${reminder.date}T${reminder.time}:00`);
                        const isPast = reminderDate < new Date();
                        if (isPast) {
                            return (
                                <View className="self-start bg-zinc-800/80 px-3 py-1.5 rounded-lg mb-6 border border-white/10 flex-row items-center gap-2">
                                    <View className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                    <Text className="text-zinc-400 text-xs font-sans-bold uppercase tracking-wider">
                                        Event Passed
                                    </Text>
                                </View>
                            );
                        }
                        return null;
                    })()}

                    {/* Title */}
                    <Text className={`text-white text-large font-sans-bold leading-[1.1] mb-10 ${isCompleted ? 'text-zinc-500 line-through' : ''}`}>
                        {reminder.title}
                    </Text>

                    {/* Info Rows */}
                    <View className="gap-8">
                        {/* Time & Date */}
                        <View className="flex-row items-start gap-5">
                            <View className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/5 items-center justify-center shrink-0">
                                <Clock size={24} color="#a1a1aa" />
                            </View>
                            <View className="pt-1">
                                <Text className="text-zinc-500 text-xs font-sans-bold uppercase tracking-[1px] mb-1.5">TIME & DATE</Text>
                                <Text className="text-white text-xl font-sans-bold">
                                    {reminder.time} • {format(new Date(reminder.date), 'yyyy-MM-dd')}
                                </Text>
                            </View>
                        </View>

                        {/* Location */}
                        <View className="flex-row items-start gap-5">
                            <View className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/5 items-center justify-center shrink-0">
                                <MapPin size={24} color="#a1a1aa" />
                            </View>
                            <View className="pt-1">
                                <Text className="text-zinc-500 text-xs font-sans-bold uppercase tracking-[1px] mb-1.5">LOCATION</Text>
                                <Text className="text-white text-xl font-sans-bold">
                                    {reminder.location || 'No location set'}
                                </Text>
                            </View>
                        </View>

                        {/* Notes */}
                        <View className="flex-row items-start gap-5">
                            <View className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/5 items-center justify-center shrink-0">
                                <FileText size={24} color="#a1a1aa" />
                            </View>
                            <View className="flex-1 pt-1">
                                <Text className="text-zinc-500 text-xs font-sans-bold uppercase tracking-[1px] mb-3">NOTES</Text>
                                <View className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 w-full">
                                    <Text className="text-zinc-300 text-md font-sans-medium leading-7">
                                        {reminder.note || 'No additional notes provided.'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Safe Area / Action */}
            <SafeAreaView edges={['bottom']} className="px-6 pb-8 bg-[#050505]">
                {/* Main Action Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    className="w-full h-16 shadow-lg shadow-purple-500/20"
                    onPress={handleToggle}
                    disabled={isSaving}
                >
                    <LinearGradient
                        colors={isCompleted ? ['#202022', '#202022'] : ['#d946ef', '#9333ea']} // Fuchsia to Purple
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flex: 1,
                            borderRadius: 100,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10
                        }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                {isCompleted ? (
                                    <CheckCircle size={20} color="#71717a" />
                                ) : (
                                    <CheckCircle size={20} color="white" />
                                )}
                                <Text className={`font-sans-bold text-lg ${isCompleted ? 'text-zinc-500' : 'text-white'}`}>
                                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                                </Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}
