import React, { useRef, useState, useEffect } from 'react';
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

    // Anchor the visible window to a base date.
    const [baseDate, setBaseDate] = useState(() => startOfDay(new Date(selectedDate)));

    useEffect(() => {
        const sel = startOfDay(new Date(selectedDate));
        // We consider the "visible" window to be roughly 5 days from the base date.
        // If they pick a date outside this visible range, we snap the strip to the new date.
        const visibleStart = addDays(baseDate, -1);
        const visibleEnd = addDays(baseDate, 5);

        if (sel < visibleStart || sel > visibleEnd) {
            setBaseDate(sel);
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        }
    }, [selectedDate, baseDate]);

    const startDate = addDays(baseDate, -2);
    const days = eachDayOfInterval({
        start: startDate,
        end: addDays(startDate, 16) // Generates a focused ~2 week window
    });

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
