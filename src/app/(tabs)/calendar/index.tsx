import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Theme } from '@/theme';
import { Text } from '@/components/ui/Text';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarStrip } from '@/components/calendar/CalendarStrip';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { useRemindersMock } from '@/hooks/useRemindersMock';
import { addMonths, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { Layout } from "@/constants/layout";
import { SectionList } from 'react-native';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date()); // For grid navigation
    const [isGridVisible, setIsGridVisible] = useState(false);

    // Mock user plan for EventCard reuse
    const userPlan = 'Premium';

    // Mock data
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { reminders } = useRemindersMock(dateStr);

    // Filter reminders for the specific date
    const dailyReminders = reminders.filter(r => r.date === dateStr);

    // Mock density dots (just random for now or based on mock)
    const dots = {
        [dateStr]: dailyReminders.length,
        [format(addMonths(new Date(), 0), 'yyyy-MM-15')]: 2,
    };

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView edges={['top']} className="flex-1"
                style={{
                    paddingTop: 20,
                }}>
                <CalendarHeader
                    currentDate={selectedDate}
                    onTodayPress={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setViewDate(today);
                    }}
                />

                <CalendarStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    dots={dots}
                />

                {/* Reminders List */}
                <View className="flex-1 mt-2 bg-bg-primary">
                    <Text variant="micro" className="px-6 mb-4 text-text-dim">
                        Reminders for {format(selectedDate, 'MMMM d')}
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
                                    />
                                </View>
                            )}
                            contentContainerStyle={{
                                ...Layout.tabBarAwareContent,
                                paddingHorizontal: 24
                            }}
                            renderSectionHeader={() => null}
                        />
                    ) : (
                        <EmptyState
                            message="No reminders"
                            subtext={`You have no tasks for ${format(selectedDate, 'EEEE, MMM d')}`}
                            icon={<CalendarIcon size={32} color={Theme.colors.muted} />}
                        />
                    )}
                </View>

                {/* Grid Overlay */}
                {isGridVisible && (
                    <CalendarGrid
                        currentDate={viewDate}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onChangeMonth={(amt) => setViewDate(prev => addMonths(prev, amt))}
                        onClose={() => setIsGridVisible(false)}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
