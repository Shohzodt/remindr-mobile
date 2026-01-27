import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

import { Text } from '../ui/Text';
import { Theme } from '@/theme';

interface TabIconProps {
    focused: boolean;
    name: 'Timeline' | 'Discover' | 'Calendar' | 'Profile';
    avatarUrl?: string; // Add avatarUrl prop
}

export const TabIcon = ({ focused, name, avatarUrl }: TabIconProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withSpring(focused ? 1.02 : 1, { damping: 50 });
        opacity.value = withTiming(focused ? 1 : 0.5, { duration: 200 });
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
        alignItems: 'center',
        gap: 4
    }));

    const color = focused ? '#8B5CF6' : '#FFFFFF';

    const getIcon = () => {
        switch (name) {
            case 'Timeline':
                return (
                    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <Path
                            stroke={color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </Svg>
                );
            case 'Discover':
                return (
                    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <Path
                            stroke={color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM14.5 9.5 10 14l-.5-4.5 5 0Z"
                        />
                    </Svg>
                );
            case 'Calendar':
                return (
                    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <Path
                            stroke={color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </Svg>
                );
            case 'Profile':
                if (avatarUrl) {
                    return (
                        <View className={`w-6 h-6 rounded-full overflow-hidden border ${focused ? 'border-[#8B5CF6]' : 'border-white/20'}`}>
                            {/* Use standard Image for avatar */}
                            <Animated.Image
                                source={{ uri: avatarUrl }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        </View>
                    );
                }
                return (
                    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <Path
                            stroke={color}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </Svg>
                );
        }
    };

    return (
        <Animated.View style={animatedStyle}>
            {getIcon()}
            <Text
                weight="bold" // Always bold as per web
                className={`text-xs tracking-tight ${focused ? 'text-accent-purple' : 'text-zinc-500'}`}
            >
                {name}
            </Text>
        </Animated.View>
    );
};
