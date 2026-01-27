import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from './ui/Text';

interface SettingsItemProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    type?: 'link' | 'switch' | 'action';
    isEnabled?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    isDestructive?: boolean;
    rightElement?: React.ReactNode;
}

export const SettingsItem = ({
    icon: Icon,
    label,
    value,
    type = 'link',
    isEnabled,
    onToggle,
    onPress,
    isDestructive,
    rightElement,
}: SettingsItemProps) => {
    const isSwitch = type === 'switch';

    return (
        <TouchableOpacity
            onPress={isSwitch ? undefined : onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
            disabled={isSwitch}
            className="flex-row items-center justify-between p-4 bg-logo-container border-b border-white/5 first:rounded-t-2xl last:rounded-b-2xl last:border-b-0"
        >
            <View className="flex-row items-center gap-3">
                <View className={`w-8 h-8 items-center justify-center rounded-lg ${isDestructive ? 'bg-destructive/10' : 'bg-surface'}`}>
                    <Icon size={18} color={isDestructive ? '#ef4444' : '#a1a1aa'} />
                </View>
                <Text
                    variant="body"
                    className={isDestructive ? 'text-destructive' : 'text-white'}
                >
                    {label}
                </Text>
            </View>

            <View className="flex-row items-center gap-2">
                {value && (
                    <Text variant="body" className="text-text-muted">
                        {value}
                    </Text>
                )}

                {isSwitch ? (
                    <Switch
                        trackColor={{ false: '#27272a', true: '#8B5CF6' }}
                        thumbColor={'#ffffff'}
                        ios_backgroundColor="#27272a"
                        onValueChange={onToggle}
                        value={isEnabled}
                    />
                ) : type === 'link' ? (
                    <ChevronRight size={18} color="#52525b" />
                ) : (
                    rightElement
                )}
            </View>
        </TouchableOpacity>
    );
};
