import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from './ui/Text';

// ... imports

interface LargeSettingsItemProps {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onPress?: () => void;
    iconColor?: string;
    iconFill?: string;
}

export const LargeSettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    iconColor = '#a1a1aa',
    iconFill,
}: LargeSettingsItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="w-full p-5 rounded-[30px] flex-row items-center gap-4 bg-[#121217]/60 border border-white/5 mb-4"
        >
            {/* Icon Box */}
            <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center">
                <Icon
                    size={24}
                    color={iconColor}
                    fill={iconFill}
                    strokeWidth={iconFill ? 0 : 2}
                />
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text variant="body" weight="extrabold" className="text-white mb-0.5">
                    {title}
                </Text>
                <Text variant="caption" weight="medium" className="text-text-muted">
                    {subtitle}
                </Text>
            </View>

            {/* Chevron */}
            <ChevronRight size={20} color="#27272a" />
        </TouchableOpacity>
    );
};
