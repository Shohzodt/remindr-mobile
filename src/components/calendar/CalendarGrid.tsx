import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/ui/Text';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { Theme } from '@/theme';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarGridProps {
    currentDate: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
    onChangeMonth: (amount: number) => void;
}

export const CalendarGrid = ({ currentDate, selectedDate, onSelectDate, onClose, onChangeMonth }: CalendarGridProps) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart); // Ensure we start on correct DOW
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
            <BlurView
                intensity={80} // Heavy blur for overlay
                tint="dark"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="flex-1 bg-black/50 justify-center px-4">
                <View className="bg-bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => onChangeMonth(-1)} className="p-2">
                            <ChevronLeft size={20} color="white" />
                        </TouchableOpacity>

                        <Text variant="h3" weight="bold" className="text-white">
                            {format(currentDate, 'MMMM yyyy')}
                        </Text>

                        <TouchableOpacity onPress={() => onChangeMonth(1)} className="p-2">
                            <ChevronRight size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Days Header */}
                    <View className="flex-row justify-between mb-4">
                        {weekDays.map(day => (
                            <Text key={day} variant="micro" className="text-zinc-500 w-10 text-center">{day}</Text>
                        ))}
                    </View>

                    {/* Grid */}
                    <View className="flex-row flex-wrap">
                        {days.map((date) => {
                            const isCurrentMonth = isSameMonth(date, monthStart);
                            const isSelected = isSameDay(date, selectedDate);
                            const isToday = isSameDay(date, new Date());

                            return (
                                <TouchableOpacity
                                    key={date.toString()}
                                    onPress={() => {
                                        onSelectDate(date);
                                        onClose();
                                    }}
                                    className="w-[14.28%] aspect-square items-center justify-center mb-2"
                                >
                                    <View className={`w-10 h-10 items-center justify-center rounded-full ${isSelected ? 'bg-accent-purple' : ''} ${isToday && !isSelected ? 'border border-accent-purple' : ''}`}>
                                        <Text
                                            className={`${isSelected ? 'text-white font-bold' :
                                                    isCurrentMonth ? 'text-white' : 'text-zinc-700'
                                                }`}
                                        >
                                            {format(date, 'd')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-6 self-center bg-white/10 px-6 py-3 rounded-full"
                    >
                        <Text weight="bold" className="text-white">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
