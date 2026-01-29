import { apiClient } from './api.client';
import { TokenStorage } from './storage';
import { User } from '@/types';
import * as Crypto from 'expo-crypto';

interface AuthResponse {
    accessToken: string;
    refreshToken: string; // Optional if we only get access token
    user: User;
}

export const TelegramAuthService = {
    /**
     * Step 1: Generate a local nonce.
     */
    async getAuthNonce(): Promise<string> {
        return Crypto.randomUUID();
    },

    /**
     * Step 3 (Final): The deep link contains the actual Access Token.
     * We just need to store it and fetch the user profile.
     */
    async completeAuth(accessToken: string, refreshToken?: string): Promise<AuthResponse> {
        // 1. Store the Access Token (and Refresh Token if available)
        await TokenStorage.setTokens(accessToken, refreshToken || '');

        // 2. Fetch the user profile using the new token
        try {
            const userResponse = await apiClient.get<User>('/auth/me');
            const user = userResponse.data;

            return {
                accessToken,
                refreshToken: refreshToken || '',
                user
            };
        } catch (error) {
            console.error('Failed to fetch user after telegram login', error);
            throw error;
        }
    }
};
