import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { format } from 'date-fns';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react-native';
import { Theme } from '@/theme';

interface CalendarHeaderProps {
    currentDate: Date;
    onTodayPress: () => void;
}

export const CalendarHeader = ({ currentDate, onTodayPress }: CalendarHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
            <View className="flex-row items-center gap-2">
                <Text variant="h2" weight="extrabold" className="text-white">
                    {format(currentDate, 'MMMM yyyy')}
                </Text>
                {/* Future: Month picker modal trigger */}
                <TouchableOpacity activeOpacity={0.7}>
                    <ChevronDown size={20} color={Theme.colors.textDim} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={onTodayPress}
                className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 active:bg-white/10"
            >
                <CalendarIcon size={14} color={Theme.colors.text} />
                <Text variant="caption" weight="bold" className="text-white">Today</Text>
            </TouchableOpacity>
        </View>
    );
};
