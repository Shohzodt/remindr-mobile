import React, { useState } from 'react';
import { View, SectionList, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Theme } from '@/theme';
import { Text } from '@/components/ui/Text';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarStrip } from '@/components/calendar/CalendarStrip';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { addMonths, format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react-native';
import { Layout } from "@/constants/layout";
import { useReminders } from '@/hooks/useReminders';

export default function CalendarScreen() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [viewDate, setViewDate] = useState(new Date()); // For grid navigation
    const [isGridVisible, setIsGridVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Use Real Hook
    const { reminders, isLoading, refetch, toggleReminder } = useReminders();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
        }
    };

    // Filter reminders for the selected date
    const dailyReminders = reminders.filter(r => r.date === selectedDate);

    const { top: insetsTop } = useSafeAreaInsets();

    // Mock user plan for EventCard reuse
    const userPlan = 'Premium';

    // Calculate dots for CalendarStrip based on all reminders
    const dots = reminders.reduce((acc, reminder) => {
        acc[reminder.date] = (acc[reminder.date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView edges={['top']} className="flex-1"
                style={{
                    paddingTop: 20,
                }}>
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <RefreshControl refreshing={true} tintColor="white" />
                    </View>
                ) : (
                    <>
                        <CalendarHeader
                            currentDate={new Date(selectedDate)}
                            onTodayPress={() => {
                                const today = new Date();
                                setSelectedDate(today.toISOString().split('T')[0]);
                                setViewDate(today);
                            }}
                        />

                        <CalendarStrip
                            selectedDate={selectedDate}
                            onSelectDate={(dateStr) => setSelectedDate(dateStr)}
                            dots={dots}
                        />

                        <View className="flex-1 mt-2 bg-bg-primary">
                            <Text variant="micro" className="px-6 mb-4 text-text-dim">
                                Reminders for {format(new Date(selectedDate), 'MMMM d')}
                            </Text>

                            {dailyReminders.length > 0 ? (
                                <SectionList
                                    sections={[{ title: 'Reminders', data: dailyReminders }]}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <View className="mb-3">
                                            <EventCard
                                                item={item}
                                                userPlan={userPlan}
                                                onClick={() => { }}
                                                onToggle={() => toggleReminder(item.id, item.status === 'completed' ? 'active' : 'completed')}
                                            />
                                        </View>
                                    )}
                                    contentContainerStyle={{
                                        ...Layout.tabBarAwareContent,
                                        paddingHorizontal: 24,
                                        paddingBottom: 100 // Extra padding for tab bar
                                    }}
                                    renderSectionHeader={() => null}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={handleRefresh}
                                            tintColor="white"
                                        />
                                    }
                                />
                            ) : (
                                <ScrollView
                                    className="flex-1 px-6"
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isLoading || isRefreshing}
                                            onRefresh={handleRefresh}
                                            tintColor="white"
                                        />
                                    }
                                >
                                    <EmptyState
                                        message="No reminders"
                                        subtext={`You have no tasks for ${format(new Date(selectedDate), 'EEEE, MMM d')}`}
                                        icon={<CalendarIcon size={32} color={Theme.colors.muted} />}
                                    />
                                </ScrollView>
                            )}
                        </View>
                        {/* Grid Overlay */}
                        {isGridVisible && (
                            <CalendarGrid
                                currentDate={viewDate}
                                selectedDate={new Date(selectedDate)}
                                onSelectDate={(date) => setSelectedDate(date.toISOString().split('T')[0])}
                                onChangeMonth={(amt) => setViewDate(prev => addMonths(prev, amt))}
                                onClose={() => setIsGridVisible(false)}
                            />
                        )}
                    </>
                )}
            </SafeAreaView>
        </View>
    );
}
