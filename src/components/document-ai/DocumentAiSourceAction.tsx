import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { UploadCloud } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface DocumentAiSourceActionProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    disabled: boolean;
    onPress: () => void;
}

export function DocumentAiSourceAction({
    icon,
    title,
    subtitle,
    disabled,
    onPress,
}: DocumentAiSourceActionProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            disabled={disabled}
            onPress={onPress}
            className="min-h-[68px] flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            style={{ opacity: disabled ? 0.65 : 1 }}
        >
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-accent-purple/20">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-base font-sans-extrabold text-white">
                    {title}
                </Text>
                <Text className="mt-1 text-xs font-sans-bold leading-4 text-[#71717a]">
                    {subtitle}
                </Text>
            </View>
            <UploadCloud size={18} color="#71717a" />
        </TouchableOpacity>
    );
}
