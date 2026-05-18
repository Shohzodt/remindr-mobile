import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/ui/Text';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths } from 'date-fns';
import { Theme } from '@/theme';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
                <View className="bg-[#151518] border border-white/10 rounded-3xl p-6 shadow-2xl">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity onPress={() => onChangeMonth(-1)} className="p-2">
                            <ChevronLeft size={20} color="white" />
                        </TouchableOpacity>

                        <Text variant="h2" className="text-white font-sans-extrabold text-2xl tracking-tight">
                            {format(currentDate, 'MMMM yyyy')}
                        </Text>

                        <TouchableOpacity onPress={() => onChangeMonth(1)} className="p-2">
                            <ChevronRight size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Days Header */}
                    <View className="flex-row justify-between mb-4">
                        {weekDays.map(day => (
                            <Text key={day} className="text-[#52525c] w-[14.28%] text-center text-[10px] font-sans-extrabold tracking-widest uppercase">{day}</Text>
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
                                    {isSelected ? (
                                        <LinearGradient
                                            colors={['#e12afb', '#9810fa']}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ 
                                                width: 44, 
                                                height: 44, 
                                                borderRadius: 22, 
                                                alignItems: 'center', 
                                                justifyContent: 'center' 
                                            }}
                                        >
                                            <Text className="text-white font-sans-bold">{format(date, 'd')}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View 
                                            style={{ 
                                                width: 44, 
                                                height: 44, 
                                                borderRadius: 22, 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                borderWidth: isToday ? 1 : 0,
                                                borderColor: isToday ? '#d946ef' : 'transparent'
                                            }}
                                        >
                                            <Text
                                                className={`${isCurrentMonth ? 'text-white font-sans-bold' : 'text-zinc-600 font-sans-medium'}`}
                                            >
                                                {format(date, 'd')}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-6 bg-[#202022] border border-white/5 py-4 rounded-2xl items-center w-full active:bg-white/10"
                    >
                        <Text className="text-white font-sans-bold tracking-wide">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
