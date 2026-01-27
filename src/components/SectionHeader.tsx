import React from 'react';
import { View } from 'react-native';
import { Text } from './ui/Text';

interface SectionHeaderProps {
    title: string;
    className?: string;
}

export const SectionHeader = ({ title, className }: SectionHeaderProps) => {
    return (
        <View className={`mb-2 px-4 ${className}`}>
            <Text variant="micro" className="text-text-muted">
                {title}
            </Text>
        </View>
    );
};
