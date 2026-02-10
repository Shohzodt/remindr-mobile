import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputScreenProps {
    onBack: () => void;
    title: string;
    subtitle?: string;
    error?: string;
    isLoading: boolean;
    onContinue: () => void;
    continueText?: string;
    continueDisabled?: boolean;
    children: React.ReactNode;
    secondaryAction?: React.ReactNode;
}

export const AuthInputScreen: React.FC<AuthInputScreenProps> = ({
    onBack,
    title,
    subtitle,
    error,
    isLoading,
    onContinue,
    continueText = "Continue",
    continueDisabled = false,
    children,
    secondaryAction
}) => {
    return (
        <View className="w-full flex-1">
            {/* Back Button */}
            <TouchableOpacity
                onPress={onBack}
                className="mb-8 flex-row items-center self-start active:opacity-60"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" size={24} color="#A1A1AA" />
            </TouchableOpacity>

            {/* Title */}
            <Text className={`text-white text-large font-bold self-start tracking-tight ${subtitle ? 'mb-2' : 'mb-8'}`}>
                {title}
            </Text>

            {/* Subtitle */}
            {subtitle && (
                <Text className="text-text-secondary text-base mb-6 self-start">
                    {subtitle}
                </Text>
            )}

            {/* Input Area */}
            <View className="w-full mb-4">
                {children}
            </View>

            {/* Error Message */}
            {error ? (
                <Text className="text-red-500 text-sm mb-4 font-medium">{error}</Text>
            ) : null}

            {/* Continue Button */}
            <TouchableOpacity
                className={`h-14 rounded-2xl w-full flex-row items-center justify-center mb-4 ${isLoading || continueDisabled ? 'bg-zinc-800' : 'bg-white'
                    }`}
                onPress={onContinue}
                disabled={isLoading || continueDisabled}
                activeOpacity={0.8}
            >
                {isLoading ? (
                    <ActivityIndicator color={continueDisabled ? '#52525B' : '#000'} />
                ) : (
                    <Text className={`text-base font-bold ${continueDisabled ? 'text-zinc-500' : 'text-black'
                        }`}>
                        {continueText}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Secondary Action (e.g. Resend) */}
            {secondaryAction}
        </View>
    );
};
