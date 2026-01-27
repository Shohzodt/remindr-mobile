import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { Theme } from '@/theme';

export default function ProfileSettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 24,
                    paddingBottom: 40
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="flex-row items-center gap-6 mb-12">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text variant="h2" weight="extrabold" className="text-white tracking-tighter">
                        Profile Info
                    </Text>
                </View>

                {/* Avatar Section */}
                <View className="items-center mb-12">
                    <View className="relative mb-4 group">
                        {/* Avatar Container */}
                        <View className="w-28 h-28 rounded-[36px] overflow-hidden border-4 border-[#121217] bg-surface-dark items-center justify-center relative">
                            {user?.avatarUrl ? (
                                <Image
                                    source={{ uri: user.avatarUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text className="text-4xl text-white font-sans-medium">
                                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                                </Text>
                            )}

                            {/* Hover/Edit Overlay (Always visible on mobile as a hint or rely on button below) 
                 Web has hover, mobile usually needs explicit button. 
                 The web design shows an icon overlay on hover. 
             */}
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.7}>
                        <Text variant="micro" className="text-accent-purple tracking-widest">
                            CHANGE PROFILE PHOTO
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Form Sections */}
                <View className="gap-10">
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Identity
                        </Text>

                        <View className="gap-4">
                            {/* Name Input */}
                            <View className="w-full h-16 bg-white/5 border border-white/10 rounded-[22px] px-6 relative justify-center">
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Full Name"
                                    placeholderTextColor="#52525b"
                                    className="font-sans-bold text-white"
                                    style={{
                                        paddingVertical: 0,
                                        fontFamily: 'PlusJakartaSans_700Bold'
                                    }}
                                    textAlignVertical="center"
                                />
                                <View className="absolute right-6 top-0 bottom-0 justify-center">
                                    <Text variant="micro" className="text-zinc-700 tracking-widest text-[10px]">
                                        NAME
                                    </Text>
                                </View>
                            </View>

                            {/* Email Input */}
                            <View className="w-full h-16 bg-white/5 border border-white/10 rounded-[22px] px-6 relative justify-center">
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email Address"
                                    placeholderTextColor="#52525b"
                                    keyboardType="email-address"
                                    className="font-sans-bold text-white"
                                    style={{
                                        paddingVertical: 0,
                                        fontFamily: 'PlusJakartaSans_700Bold'
                                    }}
                                    textAlignVertical="center"
                                />
                                <View className="absolute right-6 top-0 bottom-0 justify-center">
                                    <Text variant="micro" className="text-zinc-700 tracking-widest text-[10px]">
                                        EMAIL
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="w-full h-16"
                    >
                        <LinearGradient
                            colors={['#9333ea', '#ec4899']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                borderRadius: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text className="text-white font-sans-extrabold text-base tracking-wide">
                                Save Changes
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
