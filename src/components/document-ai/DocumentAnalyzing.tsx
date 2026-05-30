import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';
import { Sparkles, X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';

interface DocumentAnalyzingProps {
    onClose: () => void;
}

export function DocumentAnalyzing({ onClose }: DocumentAnalyzingProps) {
    return (
        <>
            <View className="mb-6 h-10 items-end">
                <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <X size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View className="min-h-[420px] items-center justify-center">
                <ScanningIndicator />

                <Text className="text-[28px] font-sans-extrabold text-white">
                    Analyzing document...
                </Text>
                <Text className="mt-3 text-sm font-sans-bold text-[#71717a]">
                    Looking for reminder-worthy dates.
                </Text>
            </View>
        </>
    );
}

function ScanningIndicator() {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1100,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => {
            animation.stop();
            spinValue.setValue(0);
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View className="mb-8 h-28 w-28 items-center justify-center">
            <Animated.View
                className="absolute inset-0 rounded-full border-4 border-white"
                style={{ transform: [{ rotate: spin }] }}
            >
                <View className="absolute bottom-0 right-1 h-9 w-9 rounded-full bg-accent-purple" />
            </Animated.View>

            <View className="h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
                <Sparkles size={28} color={Theme.colors.accentPurple} />
            </View>
        </View>
    );
}
