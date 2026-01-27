import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { TabIcon } from './TabIcon';
import { useAuth } from '@/context/AuthContext';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const router = useRouter();
    const { user } = useAuth();

    // Create Button Handler
    const handleCreate = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log('Create button pressed');
    };

    return (
        <View style={styles.wrapper}>
            {/* Dark background layer to ensure opacity matches web #050505/95 */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5, 5, 5, 0.8)' }]} />

            <BlurView
                intensity={30} // Lower intensity for subtle glass
                tint="dark"
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.contentContainer}>
                <View className="flex-row items-end justify-between px-2 pb-5 h-full">

                    {/* Timeline Tab */}
                    {/* Fixed: Point to (timeline) stack */}
                    <TabBarItem
                        name="Timeline"
                        routeName="(timeline)"
                        state={state}
                        navigation={navigation}
                    />

                    {/* Discover Tab */}
                    {/* Updated to use discover/index to match _layout.tsx and file structure reliably */}
                    <TabBarItem
                        name="Discover"
                        routeName="discover/index"
                        state={state}
                        navigation={navigation}
                    />

                    <TouchableOpacity
                        className="w-14 h-14 mb-2 mx-4"
                        activeOpacity={0.9}
                        onPress={handleCreate}
                        style={styles.shadow}
                    >
                        <LinearGradient
                            colors={['#ad46ff', '#c800de']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                borderRadius: 100, // Fixed string '100%' warning potentially
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Plus size={28} color="white" strokeWidth={2.5} />
                        </LinearGradient>
                    </TouchableOpacity>


                    {/* Calendar Tab */}
                    <TabBarItem
                        name="Calendar"
                        routeName="calendar/index"
                        state={state}
                        navigation={navigation}
                    />

                    {/* Profile Tab */}
                    {/* Fixed: Point to settings stack for proper navigation */}
                    <TabBarItem
                        name="Profile"
                        routeName="settings"
                        state={state}
                        navigation={navigation}
                        avatarUrl={user?.avatarUrl}
                    />

                </View>
            </View>
        </View>
    );
}

function TabBarItem({ name, routeName, state, navigation, avatarUrl }: {
    name: 'Timeline' | 'Discover' | 'Calendar' | 'Profile';
    routeName: string;
    state: any;
    navigation: any;
    avatarUrl?: string; // Add avatarUrl support
}) {

    // Find index of the route
    const index = state.routes.findIndex((r: any) => r.name === routeName);

    // Safety check
    if (index === -1) return null;

    const isFocused = state.index === index;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index]?.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            Haptics.selectionAsync();
            navigation.navigate(routeName);
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center pb-2"
        >
            <TabIcon focused={isFocused} name={name} avatarUrl={avatarUrl} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Compact height like web (100px includes bottom safe area usually, but 85 is tight)
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 8
    },
    shadow: {
        shadowColor: '#8b5cf6',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    }
});
