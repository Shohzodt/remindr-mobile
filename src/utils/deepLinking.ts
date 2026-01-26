import * as Linking from 'expo-linking';

/**
 * Parses the deep link URL to extract the token.
 * Expected format: remindr://auth/telegram?token=<JWT>
 */
export const parseTelegramAuthCode = (url: string): string | null => {
    try {
        const parsed = Linking.parse(url);

        // Check for 'login' path (as per user update) and 'token' param
        if (parsed.path === 'login' && parsed.queryParams?.token) {
            const token = parsed.queryParams.token;
            return typeof token === 'string' ? token : null;
        }

        // Fallback/Legacy: Check for 'auth/telegram' and 'code'
        if (parsed.path === 'auth/telegram' && parsed.queryParams?.code) {
            const code = parsed.queryParams.code;
            return typeof code === 'string' ? code : null;
        }

        return null;
    } catch (error) {
        console.error('Error parsing deep link:', error);
        return null;
    }
};

/**
 * Constructs the Telegram Bot deep link.
 * Format: tg://resolve?domain=<BOT_USERNAME>&start=AUTH_<NONCE>
 */
export const getTelegramBotDeepLink = (botUsername: string, nonce: string): string => {
    return `tg://resolve?domain=${botUsername}&start=AUTH_${nonce}`;
};
