import { useState } from 'react';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

/**
 * Simplified Telegram auth hook.
 * Just opens the Telegram bot - user gets OTP code there and enters it in the app.
 */
export const useTelegramAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const openTelegramBot = async () => {
        setIsLoading(true);
        try {
            await Linking.openURL(process.env.EXPO_PUBLIC_TELEGRAM_BOT_URL || '');
        } catch (error) {
            console.error('Failed to open Telegram:', error);
            Alert.alert('Error', 'Could not open Telegram. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        openTelegramBot
    };
};
