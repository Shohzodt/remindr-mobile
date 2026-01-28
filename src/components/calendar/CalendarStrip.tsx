import React, { useRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { format, addDays, isSameDay, eachDayOfInterval, startOfDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

interface CalendarStripProps {
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (date: string) => void;
    dots?: Record<string, number>; // dateString (YYYY-MM-DD) -> count
}

export const CalendarStrip = ({ selectedDate, onSelectDate, dots = {} }: CalendarStripProps) => {
    const scrollViewRef = useRef<ScrollView>(null);

    // Use a fixed anchor for "Today" so list doesn't shift
    // Range: -15 days ... Today ... +15 days
    const anchorDate = startOfDay(new Date());
    const startDate = addDays(anchorDate, -2);
    const days = eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, 15) // 15 before + today + 14 after = 30 days window approx? Let's do 30.
    });

    // Generate days around selected date or fixed window
    // For simplicity, let's show +/- 14 days from selected? 
    // Or better, show current week + next 2 weeks?
    // Let's settle on generating a sliding window relative to selectedDate
    // Actually, standard behavior is usually infinite scroll, but we'll stick to a 30-day window centered on today/selected for MVP
    // to avoid complex virtualization for now.

    return (
        <View className="h-24">
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
                {days.map((date, index) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isSelected = dateStr === selectedDate;
                    const isToday = isSameDay(date, new Date());
                    const hasDots = dots[dateStr] ? dots[dateStr] > 0 : false;

                    return (
                        <TouchableOpacity
                            key={date.toString()}
                            onPress={() => onSelectDate(dateStr)}
                            className="items-center justify-center w-[52px]"
                        >
                            <View className={`w-[52px] h-[72px] rounded-2xl overflow-hidden justify-between py-2 items-center ${isToday && !isSelected ? 'border border-[#8B5CF6]' : ''}`}>
                                {isSelected ? (
                                    <LinearGradient
                                        colors={['#a855f7', '#d946ef']} // Brand Gradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    // Default background
                                    <View className="absolute w-full h-full bg-transparent" />
                                )}

                                <Text
                                    variant="micro"
                                    className={`${isSelected ? 'text-white/80' : 'text-zinc-500'}`}
                                >
                                    {format(date, 'EEE').toUpperCase()}
                                </Text>

                                <View className="items-center justify-center w-8 h-8 rounded-full mb-1">
                                    <Text
                                        variant="h3"
                                        weight="bold"
                                        className={`${isSelected ? 'text-white' : 'text-white'}`}
                                    >
                                        {format(date, 'd')}
                                    </Text>
                                </View>

                                {/* Dot Indicator */}
                                <View className={`w-1.5 h-1.5 rounded-full ${hasDots ? (isSelected ? 'bg-white' : 'bg-accent-purple') : 'bg-transparent'}`} />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
