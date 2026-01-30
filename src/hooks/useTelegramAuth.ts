import { useState, useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { TelegramAuthService } from '../services/telegramAuth.service';
import { getTelegramBotDeepLink, parseTelegramAuthCode } from '../utils/deepLinking';
import { useAuth } from '../context/AuthContext';

export const useTelegramAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithTelegram } = useAuth();

    const initiateTelegramLogin = async () => {
        setIsLoading(true);
        try {
            // Open Telegram Bot with 'mobile' start parameter
            await Linking.openURL(process.env.EXPO_PUBLIC_TELEGRAM_BOT_URL);

        } catch (error) {
            console.error('Failed to initiate Telegram login:', error);
            Alert.alert('Error', 'Could not start Telegram login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeepLink = useCallback(async (url: string) => {
        // Parse the token (JWT) from the URL
        const token = parseTelegramAuthCode(url);

        if (token) {
            try {
                setIsLoading(true);
                // 4. Verify & Login
                // 4. Verify & Login
                // Pass tokens to existing context action
                if ('initData' in token && token.initData) {
                    await loginWithTelegram({ initData: token.initData });
                } else if ('accessToken' in token && typeof token.accessToken === 'string') {
                    // Old flow: direct token
                    await loginWithTelegram({
                        code: token.accessToken || undefined, // Type guard fallback
                        refreshToken: token.refreshToken || undefined
                    });
                } else if (typeof token === 'string') {
                    // Legacy, shouldn't happen with updated parser but good for safety
                    await loginWithTelegram({ code: token });
                }
            } catch (error) {
                console.error('Deep link login failed:', error);
                Alert.alert('Login Failed', 'Could not verify Telegram login.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [loginWithTelegram]);

    useEffect(() => {
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        // Handle cold start from deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [handleDeepLink]);

    return {
        isLoading,
        initiateTelegramLogin
    };
};
