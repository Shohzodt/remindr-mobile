import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'remindr_access_token';
const REFRESH_TOKEN_KEY = 'remindr_refresh_token';

/**
 * Storage service for handling secure auth tokens.
 * Uses Expo SecureStore for native, AsyncStorage for web.
 */
export const TokenStorage = {
    /**
     * Save both access and refresh tokens.
     */
    async setTokens(accessToken: string, refreshToken: string): Promise<void> {
        if (Platform.OS === 'web') {
            await Promise.all([
                AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
                AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
            ]);
        } else {
            await Promise.all([
                SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
                SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
            ]);
        }
    },

    /**
     * Retrieve the access token.
     */
    async getAccessToken(): Promise<string | null> {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    /**
     * Retrieve the refresh token.
     */
    async getRefreshToken(): Promise<string | null> {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },

    /**
     * Remove all tokens (logout).
     */
    async clearTokens(): Promise<void> {
        if (Platform.OS === 'web') {
            await Promise.all([
                AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
                AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
            ]);
        } else {
            await Promise.all([
                SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
                SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
            ]);
        }
    },
};
