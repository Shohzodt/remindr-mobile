import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-react-native'; // Icons approximation

import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';


export default function SecuritySettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { logout, user } = useAuth();

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
                        Security
                    </Text>
                </View>

                <View className="gap-10">
                    {/* Connections */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Connections
                        </Text>
                        <View className="gap-3">
                            {/* Google */}
                            <View className="bg-[#121217] p-5 rounded-[28px] border border-white/5 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                                        <FontAwesome name="google" size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text variant="caption" weight="extrabold" className="text-white">Google</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[10px] capitalize lowercase" style={{ textTransform: 'none' }}>
                                            {user?.email ? `Connected as ${user.displayName?.split(' ')[0]}` : 'Not connected'}
                                        </Text>
                                    </View>
                                </View>
                                {/* Disconnect Button */}
                                <TouchableOpacity className="bg-red-500/5 px-3 py-2 rounded-lg">
                                    <Text variant="micro" className="text-red-500 tracking-widest">DISCONNECT</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Telegram */}
                            <View className="bg-[#121217] p-5 rounded-[28px] border border-white/5 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-[#24A1DE]/10 rounded-xl items-center justify-center">
                                        <FontAwesome name="telegram" size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text variant="caption" weight="extrabold" className="text-white">Telegram</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[10px] capitalize lowercase" style={{ textTransform: 'none' }}>
                                            Not linked
                                        </Text>
                                    </View>
                                </View>
                                {/* Link Button */}
                                <TouchableOpacity className="bg-[#8B5CF6]/5 px-3 py-2 rounded-lg">
                                    <Text variant="micro" className="text-[#8B5CF6] tracking-widest">LINK ACCOUNT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Access Management */}
                    <View>
                        <Text variant="micro" className="text-text-dim mb-4 pl-1 tracking-[0.2em] uppercase">
                            Access Management
                        </Text>
                        <View className="bg-[#121217] rounded-[32px] border border-white/5 p-6 gap-6">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text variant="body" weight="bold" className="text-white text-sm mb-0.5 tracking-tight">Active Sessions</Text>
                                    <Text variant="micro" className="text-zinc-500 font-sans-medium text-[11px] capitalize lowercase" style={{ textTransform: 'none' }}>Logged in on iPhone 15</Text>
                                </View>
                                <TouchableOpacity className="bg-white/5 px-3 py-2 rounded-lg">
                                    <Text variant="micro" className="text-zinc-500 tracking-widest">MANAGE</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity className="w-full py-4 bg-red-500/10 rounded-2xl border border-red-500/20 items-center">
                                <Text variant="micro" className="text-red-500 font-black tracking-widest">SIGN OUT FROM ALL DEVICES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
