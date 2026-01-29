import * as Linking from 'expo-linking';

/**
 * Helper to safely extract the first string value from a query param
 * which could be a string, an array of strings, or undefined.
 */
const getFirstParam = (param: string | string[] | undefined): string | null => {
    if (!param) return null;
    return Array.isArray(param) ? param[0] : param;
};

/**
 * Parses the deep link URL to extract the authentication token/code.
 * Supports:
 * 1. remindr://login?token=<JWT> (New flow)
 */
export const parseTelegramAuthCode = (url: string): { accessToken: string | null; refreshToken: string | null } | null => {
    try {
        const parsed = Linking.parse(url);

        // Strategy 1: Check for 'login' path with 'token' (Preferred)
        if (parsed.path === 'login') {
            const accessToken = getFirstParam(parsed.queryParams?.token);
            const refreshToken = getFirstParam(parsed.queryParams?.refreshToken);

            if (!accessToken) return null;

            return { accessToken, refreshToken };
        }

        return null;
    } catch (error) {
        console.warn('Failed to parse deep link:', error);
        return null;
    }
};

/**
 * Constructs the Telegram Bot deep link.
 * Format: tg://resolve?domain=<BOT_USERNAME>&start=AUTH_<NONCE>
 * Automatically strips '@' from username if present.
 */
export const getTelegramBotDeepLink = (botUsername: string, nonce: string): string => {
    const cleanUsername = botUsername.replace(/^@/, '');
    return `tg://resolve?domain=${cleanUsername}&start=AUTH_${nonce}`;
};
