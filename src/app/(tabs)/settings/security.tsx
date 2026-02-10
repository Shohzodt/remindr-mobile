import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Layout } from "@/constants/layout";
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import { LinkEmailModal } from '@/components/security/LinkEmailModal';
import { LinkTelegramModal } from '@/components/security/LinkTelegramModal';
import { FontAwesome } from '@expo/vector-icons';


export default function SecuritySettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const {
        isLinkEmailModalOpen,
        isLinkTelegramModalOpen,
        openLinkEmailModal,
        closeLinkEmailModal,
        openLinkTelegramModal,
        closeLinkTelegramModal,
        linkEmail,
        linkTelegram,
        logoutAll,
        logoutCurrent,
        isLinking,
        isLoggingOut,
        error,
        isTelegramLinked,
        isEmailLinked,
    } = useSecuritySettings();

    const handleLogoutAll = () => {
        Alert.alert(
            'Sign Out Everywhere',
            'This will sign you out from all devices. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out All', style: 'destructive', onPress: logoutAll },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logoutCurrent },
            ]
        );
    };

    return (
        <View className="flex-1 bg-bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    ...Layout.tabBarAwareContent,
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 24,
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
                            {/* Telegram */}
                            <View className="bg-[#121217] p-5 rounded-[28px] border border-white/5 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-[#24A1DE]/10 rounded-xl items-center justify-center">
                                        <FontAwesome name="telegram" size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text variant="caption" weight="extrabold" className="text-white">Telegram</Text>
                                        <Text variant="micro" className="text-zinc-500 font-sans-medium text-[10px] capitalize lowercase">
                                            {isTelegramLinked ? 'Linked' : 'Not linked'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    className={`px-3 py-2 rounded-lg ${isTelegramLinked ? 'bg-green-500/10' : 'bg-[#8B5CF6]/5'}`}
                                    disabled={isTelegramLinked}
                                    onPress={openLinkTelegramModal}
                                >
                                    <Text variant="micro" className={`tracking-widest ${isTelegramLinked ? 'text-green-500' : 'text-[#8B5CF6]'}`}>
                                        {isTelegramLinked ? 'LINKED' : 'LINK ACCOUNT'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Email */}
                            <View className="bg-[#121217] p-5 rounded-[28px] border border-white/5 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                                        <FontAwesome name="envelope" size={20} color="white" />
                                    </View>
                                    <View>
                                        <Text variant="caption" weight="extrabold" className="text-white">Email</Text>
                                        <Text variant="micro" className="w-full text-zinc-500 font-sans-medium text-[10px] capitalize lowercase">
                                            {isEmailLinked ? user?.email : 'Not linked'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    className={`px-3 py-2 rounded-lg ${isEmailLinked ? 'bg-green-500/10' : 'bg-[#8B5CF6]/5'}`}
                                    disabled={isEmailLinked}
                                    onPress={openLinkEmailModal}
                                >
                                    <Text variant="micro" className={`tracking-widest ${isEmailLinked ? 'text-green-500' : 'text-[#8B5CF6]'}`}>
                                        {isEmailLinked ? 'LINKED' : 'LINK EMAIL'}
                                    </Text>
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
                            {/* Sign out from all devices */}
                            <TouchableOpacity
                                className="w-full py-4 bg-red-500/10 rounded-2xl border border-red-500/20 items-center"
                                onPress={handleLogoutAll}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <ActivityIndicator color="#ef4444" size="small" />
                                ) : (
                                    <Text variant="micro" className="text-red-500 font-black tracking-widest">SIGN OUT FROM ALL DEVICES</Text>
                                )}
                            </TouchableOpacity>

                            {/* Log out */}
                            <TouchableOpacity
                                className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 items-center"
                                onPress={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <Text variant="micro" className="text-zinc-400 font-black tracking-widest">LOG OUT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Link Modals */}
            <LinkEmailModal
                visible={isLinkEmailModalOpen}
                onClose={closeLinkEmailModal}
                onSubmit={linkEmail}
                isLinking={isLinking}
                error={error}
            />
            <LinkTelegramModal
                visible={isLinkTelegramModalOpen}
                onClose={closeLinkTelegramModal}
                onSubmit={linkTelegram}
                isLinking={isLinking}
                error={error}
            />
        </View>
    );
}
