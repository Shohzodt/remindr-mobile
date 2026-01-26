import { useState, useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { TelegramAuthService } from '../services/telegramAuth.service';
import { getTelegramBotDeepLink, parseTelegramAuthCode } from '../utils/deepLinking';
import { useAuth } from '../context/AuthContext';

export const useTelegramAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithTelegram } = useAuth();

    // Get Bot Username from env or constant
    const BOT_USERNAME = process.env.EXPO_PUBLIC_TELEGRAM_BOT_USERNAME || 'remindruz_bot';

    const initiateTelegramLogin = async () => {
        setIsLoading(true);
        try {
            // 1. Get Nonce
            const nonce = await TelegramAuthService.getAuthNonce();

            // 2. Open Telegram
            const botUrl = getTelegramBotDeepLink(BOT_USERNAME, nonce);

            // We intentionally skip Checking canOpenURL because on iOS it requires 
            // LSApplicationQueriesSchemes which might not be updated in dev client immediately,
            // yet openURL often still works or we can fallback to web.
            try {
                // Try opening the app scheme directly
                await Linking.openURL(botUrl);
            } catch {
                // Silently fallback to web URL if native scheme fails (common if native config isn't rebuilt yet)
                const cleanBotName = BOT_USERNAME.replace('@', '');
                const webUrl = `https://t.me/${cleanBotName}?start=AUTH_${nonce}`;
                await Linking.openURL(webUrl);
            }
        } catch (error) {
            console.error('Failed to initiate Telegram login:', error);
            Alert.alert('Error', 'Could not start Telegram login. Please try again.');
            setIsLoading(false);
        }
    };

    const handleDeepLink = useCallback(async (url: string) => {
        const code = parseTelegramAuthCode(url);
        if (code) {
            try {
                setIsLoading(true);
                // 3. Verify Code & Login
                // Pass code to context logic which calls service
                await loginWithTelegram({ code });
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

        // Check for initial URL if app was opened via deep link
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
