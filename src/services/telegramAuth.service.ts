import { apiClient } from './api.client';
import { TokenStorage } from './storage';
import { User } from '../types/user';
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
    async completeAuth(accessToken: string): Promise<AuthResponse> {
        // 1. Store the Access Token immediately
        // Note: We might miss a refresh token if the deep link only has access token.
        // Assuming for now we just set access token.
        await TokenStorage.setTokens(accessToken, '');

        // 2. Fetch the user profile using the new token
        // apiClient interceptor will pick up the token we just stored (or we can pass headers manually)
        // Ensure apiClient reads from storage dynamically or we configure it here.
        // Usually apiClient reads from storage on every request.

        try {
            const userResponse = await apiClient.get<User>('/auth/me');
            const user = userResponse.data;

            return {
                accessToken,
                refreshToken: '', // No refresh token from deep link usually?
                user
            };
        } catch (error) {
            console.error('Failed to fetch user after telegram login', error);
            throw error;
        }
    }
};
