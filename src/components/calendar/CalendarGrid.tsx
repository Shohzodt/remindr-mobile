import React from 'react';
import { Modal, Pressable, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CalendarGridProps {
    currentDate: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
    onChangeMonth: (amount: number) => void;
    dots?: Record<string, number>;
}

const DOT_COLORS = ['#A855F7', '#60A5FA', '#34D399'];

const buildDotIndexes = (count: number) => {
    return Array.from({ length: Math.min(count, 3) }, (_, index) => index);
};

export const CalendarGrid = ({ currentDate, selectedDate, onSelectDate, onClose, onChangeMonth, dots = {} }: CalendarGridProps) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, index) => days.slice(index * 7, index * 7 + 7));
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <Modal transparent visible animationType="slide" statusBarTranslucent onRequestClose={onClose}>
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0 bg-black/80" onPress={onClose} />

                <View
                    className="relative rounded-t-[34px] border border-white/10 bg-[#111114] px-6 pt-6"
                    style={{ height: '88%', paddingBottom: 20 }}
                >
                    {/* Header */}
                    <View className="mb-6 flex-row items-start justify-between gap-4">
                        <View className="flex-1">
                            <Text className="text-two-xl font-sans-extrabold text-white" numberOfLines={1}>
                                {format(currentDate, 'MMMM yyyy')}
                            </Text>

                            <View className="mt-4 flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => onChangeMonth(-1)}
                                    className="h-9 w-9 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
                                    activeOpacity={0.8}
                                >
                                    <ChevronLeft size={18} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onChangeMonth(1)}
                                    className="h-9 w-9 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
                                    activeOpacity={0.8}
                                >
                                    <ChevronRight size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                            activeOpacity={0.8}
                        >
                            <X size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {/* Days Header */}
                    <View className="flex-row border-b border-white/10 pb-3">
                        {weekDays.map(day => (
                            <Text
                                key={day}
                                className="text-[#777782] w-[14.28%] text-center font-sans-medium uppercase"
                                style={{ fontSize: 10, lineHeight: 14, letterSpacing: 1.1 }}
                            >
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Grid */}
                    <View>
                        {weeks.map((week, weekIndex) => (
                            <View key={week[0].toString()} className={`${weekIndex > 0 ? 'border-t border-white/10' : ''}`}>
                                <View className="flex-row h-[62px]">
                                    {week.map((date) => {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        const count = dots[dateStr] ?? 0;
                                        const dotIndexes = buildDotIndexes(count);
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
                                                className="w-[14.28%] items-center justify-center"
                                                activeOpacity={0.75}
                                            >
                                                <View className="h-[52px] items-center justify-start">
                                                    {isSelected ? (
                                                        <LinearGradient
                                                            colors={['#e12afb', '#9810fa']}
                                                            start={{ x: 0, y: 1 }}
                                                            end={{ x: 1, y: 0 }}
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 18,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Text className="text-white text-[16px] font-sans-extrabold">{format(date, 'd')}</Text>
                                                        </LinearGradient>
                                                    ) : (
                                                        <View
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 18,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderWidth: isToday ? 1 : 0,
                                                                borderColor: isToday ? '#8B5CF6' : 'transparent'
                                                            }}
                                                        >
                                                            <Text
                                                                className={`${isCurrentMonth ? 'text-white' : 'text-zinc-700'} text-[16px] font-sans-semibold`}
                                                            >
                                                                {format(date, 'd')}
                                                            </Text>
                                                        </View>
                                                    )}

                                                    <View className="h-3 flex-row items-center justify-center gap-1">
                                                        {dotIndexes.map((dotIndex) => (
                                                            <View
                                                                key={dotIndex}
                                                                style={{
                                                                    width: 5,
                                                                    height: 5,
                                                                    borderRadius: 2.5,
                                                                    backgroundColor: DOT_COLORS[dotIndex],
                                                                    opacity: isCurrentMonth ? 1 : 0.35,
                                                                }}
                                                            />
                                                        ))}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
