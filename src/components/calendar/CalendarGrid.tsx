import React from 'react';
import { Modal, Pressable, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReminderCategory } from '@/types';
import { Theme } from '@/theme';
import { getReminderCategoryColor, REMINDER_CATEGORIES } from '@/constants/categories';

export interface CalendarPreviewEvent {
    id: string;
    title: string;
    category: ReminderCategory | string;
}

interface CalendarGridProps {
    currentDate: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
    onChangeMonth: (amount: number) => void;
    onTodayPress: () => void;
    dots?: Record<string, number>;
    eventsByDate?: Record<string, CalendarPreviewEvent[]>;
}

const previewTitleStyle = {
    fontSize: 8,
    lineHeight: 12,
    flexShrink: 1,
} as const;

export const CalendarGrid = ({
    currentDate,
    selectedDate,
    onSelectDate,
    onClose,
    onChangeMonth,
    onTodayPress,
    dots = {},
    eventsByDate = {},
}: CalendarGridProps) => {
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
    const rowHeight = weeks.length > 5 ? 84 : 106;

    return (
        <Modal transparent visible animationType="slide" statusBarTranslucent onRequestClose={onClose}>
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0 bg-black/80" onPress={onClose} />

                <View
                    className="relative rounded-t-[34px] border border-white/10 bg-[#111114] px-5 pt-5"
                    style={{ height: '92%', paddingBottom: 18 }}
                >
                    {/* Header */}
                    <View className="mb-5">
                        <View className="flex-row items-start justify-between gap-4">
                            <Text variant="h2" weight="extrabold" className="flex-1 text-white" numberOfLines={1}>
                                {format(currentDate, 'MMMM yyyy')}
                            </Text>

                            <TouchableOpacity
                                onPress={onClose}
                                className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                                activeOpacity={0.8}
                            >
                                <X size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        <View className="mt-5 flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
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

                            <TouchableOpacity
                                onPress={onTodayPress}
                                className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 active:bg-white/10"
                                activeOpacity={0.8}
                            >
                                <CalendarIcon size={14} color={Theme.colors.text} />
                                <Text variant="caption" weight="bold" className="text-white">Today</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Days Header */}
                    <View className="mb-4 flex-row">
                        {weekDays.map(day => (
                            <Text
                                key={day}
                                className="w-[14.28%] text-center font-sans-medium uppercase text-[#A1A1AA]"
                                style={{ fontSize: 11, lineHeight: 14, letterSpacing: 0.8 }}
                            >
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Grid */}
                    <View className="overflow-hidden rounded-[14px] border border-white/10">
                        {weeks.map((week, weekIndex) => (
                            <View key={week[0].toString()}>
                                <View className="flex-row" style={{ height: rowHeight }}>
                                    {week.map((date, dayIndex) => {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        const count = dots[dateStr] ?? 0;
                                        const previewEvents = (eventsByDate[dateStr] ?? []).slice(0, 3);
                                        const isCurrentMonth = isSameMonth(date, monthStart);
                                        const isSelected = isSameDay(date, selectedDate);
                                        const isToday = isSameDay(date, new Date());
                                        const hasMetaOnly = previewEvents.length === 0 && count > 0;

                                        return (
                                            <TouchableOpacity
                                                key={date.toString()}
                                                onPress={() => {
                                                    onSelectDate(date);
                                                    onClose();
                                                }}
                                                className="w-[14.28%]"
                                                style={{
                                                    borderRightWidth: dayIndex === 6 ? 0 : 1,
                                                    borderBottomWidth: weekIndex === weeks.length - 1 ? 0 : 1,
                                                    borderTopWidth: isToday && !isSelected ? 1 : 0,
                                                    borderLeftWidth: isToday && !isSelected ? 1 : 0,
                                                    borderColor: isToday && !isSelected ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                                                }}
                                                activeOpacity={0.75}
                                            >
                                                {isSelected ? (
                                                    <LinearGradient
                                                        colors={['#E12AFB', '#9810FA']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{
                                                            height: rowHeight - 2,
                                                            width: '100%',
                                                            margin: 1,
                                                            borderRadius: 10,
                                                            overflow: 'hidden',
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 9,
                                                        }}
                                                    >
                                                        <Text className="text-center text-[19px] leading-[22px] font-sans-extrabold text-white">
                                                            {format(date, 'd')}
                                                        </Text>
                                                        <View className="mt-1 h-1.5 w-1.5 self-center rounded-full bg-white/90" />

                                                        <View className="mt-3 gap-1">
                                                            {previewEvents.map((event) => (
                                                                <View key={event.id} className="min-w-0 flex-row items-center gap-0.5">
                                                                    <View
                                                                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                                        style={{ backgroundColor: getReminderCategoryColor(event.category) }}
                                                                    />
                                                                    <Text
                                                                        className="min-w-0 flex-1 font-sans-semibold text-white"
                                                                        style={previewTitleStyle}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode="tail"
                                                                    >
                                                                        {event.title}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </LinearGradient>
                                                ) : (
                                                    <View
                                                        className="h-full w-full px-1.5 py-2.5"
                                                        style={{
                                                            opacity: isCurrentMonth ? 1 : 0.42,
                                                        }}
                                                    >
                                                        <View
                                                            className="self-center"
                                                            style={{
                                                                minWidth: 30,
                                                                height: 30,
                                                                borderRadius: 15,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Text className="text-[18px] leading-[22px] font-sans-bold text-white">
                                                                {format(date, 'd')}
                                                            </Text>
                                                        </View>

                                                        <View className="mt-3 gap-1">
                                                            {previewEvents.map((event) => (
                                                                <View key={event.id} className="min-w-0 flex-row items-center gap-0.5">
                                                                    <View
                                                                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                                        style={{ backgroundColor: getReminderCategoryColor(event.category) }}
                                                                    />
                                                                    <Text
                                                                        className="min-w-0 flex-1 font-sans-medium text-white"
                                                                        style={previewTitleStyle}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode="tail"
                                                                    >
                                                                        {event.title}
                                                                    </Text>
                                                                </View>
                                                            ))}

                                                            {hasMetaOnly ? (
                                                                <View className="min-w-0 flex-row items-center gap-0.5">
                                                                    <View
                                                                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                                        style={{ backgroundColor: getReminderCategoryColor('work') }}
                                                                    />
                                                                    <Text
                                                                        className="min-w-0 flex-1 font-sans-medium text-white/70"
                                                                        style={previewTitleStyle}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode="tail"
                                                                    >
                                                                        {count} reminder{count === 1 ? '' : 's'}
                                                                    </Text>
                                                                </View>
                                                            ) : null}
                                                        </View>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>

                    <View className="mt-5 flex-row items-center justify-around border-t border-white/10 pt-4">
                        {REMINDER_CATEGORIES.map((category) => (
                            <View key={category.id} className="flex-row items-center gap-2">
                                <View className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                                <Text className="text-[12px] font-sans-medium text-text-muted">{category.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
