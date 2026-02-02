import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/ui/Text';

export default function TelegramAuthScreen() {
    const { token, refreshToken, accessToken } = useLocalSearchParams<{ token?: string; refreshToken?: string; accessToken?: string }>();
    const { loginWithTelegram } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleLogin = async () => {
            if (token || accessToken) {
                try {
                    await loginWithTelegram({
                        code: token || accessToken,
                        refreshToken: refreshToken || undefined
                    });
                    // Login successful - AuthContext will update user state
                    // and _layout.tsx will likely redirect to home
                } catch (error) {
                    console.error('Telegram login error:', error);
                    // On error goto login
                    router.replace('/login');
                }
            } else {
                // No token, redirect to login
                router.replace('/login');
            }
        };

        handleLogin();
    }, [token, accessToken, refreshToken]);

    return (
        <View className="flex-1 bg-[#050505] items-center justify-center">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="text-white mt-4 font-sans-medium">Verifying Telegram login...</Text>
        </View>
    );
}
