import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    size = 'large',
    color = '#8B5CF6',
}) => {
    return (
        <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size={size} color={color} />
            {message && (
                <Text className="text-md font-sans-medium text-zinc-500 mt-4">
                    {message}
                </Text>
            )}
        </View>
    );
};
