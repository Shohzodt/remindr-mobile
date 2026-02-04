import { apiClient } from './api.client';
import { TokenStorage } from './storage';
import { TelegramAuthService } from './telegramAuth.service';
import { User, AuthResponse } from '@/types';

export const AuthService = {
    /**
     * Request OTP for email login.
     */
    async requestOtp(email: string): Promise<void> {
        await apiClient.post('/auth/otp/request', { email });
    },

    /**
     * Verify OTP and login.
     * @param type - 'email' for email OTP, 'telegram' for Telegram code
     */
    async verifyOtp(email: string, otp: string, type: 'email' | 'telegram' = 'email'): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/otp/verify', { email, otp, type });
        const { accessToken, refreshToken } = response.data;
        await TokenStorage.setTokens(accessToken, refreshToken);
        return response.data;
    },

    /**
     * Login with Telegram Payload.
     */
    /**
     * Login with Telegram Payload.
     */
    async loginWithTelegram(data: { code?: string; refreshToken?: string; initData?: string }): Promise<AuthResponse> {
        if (data.initData) {
            // New Flow: Exchange initData for tokens
            const response = await apiClient.post<AuthResponse>('/auth/telegram', { initData: data.initData });
            const { accessToken, refreshToken } = response.data;
            await TokenStorage.setTokens(accessToken, refreshToken);
            return response.data;
        } else if (data.code) {
            // Old Flow: Deep link with direct token
            return TelegramAuthService.completeAuth(data.code, data.refreshToken);
        }
        throw new Error('Invalid Telegram login data');
    },

    /**
     * Get current user profile.
     */
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    /**
     * Refresh the access token using the stored refresh token.
     */
    async refreshAccessToken(): Promise<string | null> {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
                '/auth/refresh',
                { refreshToken }
            );

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
            await TokenStorage.setTokens(newAccessToken, newRefreshToken || refreshToken);

            return newAccessToken;
        } catch (error) {
            // If refresh fails, we should probably logout
            await TokenStorage.clearTokens();
            return null;
        }
    },

    /**
     * Logout the user.
     */
    async logout(): Promise<void> {
        await TokenStorage.clearTokens();
        // Optional: Call sending backend to invalidate token if needed
    },
};
