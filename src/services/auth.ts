import { apiClient } from './api.client';
import { TokenStorage } from './storage';
import { isAuthFailureStatus } from '@/utils/http';
import { User, AuthResponse, UpdateProfilePayload, LinkEmailPayload, LinkTelegramPayload } from '@/types';

const normalizeUser = (data: any): User | null => {
    const user = data?.user || data?.profile || data?.data || data;
    return user && user.id ? user : null;
};

export const AuthService = {
    /**
     * Request OTP for email login.
     */
    async requestOtp(email: string): Promise<void> {
        await apiClient.post('/auth/otp/request', { email });
    },

    /**
     * Login with OTP code (works for both Email and Telegram).
     * User receives 6-digit code via email or Telegram bot.
     */
    async login(email: string | null, code: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', { email, code });
            const { accessToken, refreshToken } = response.data;
            await TokenStorage.setTokens(accessToken, refreshToken);
            return response.data;
        } catch (error: any) {
            console.error('Login failed:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Get current user profile.
     */
    async getProfile(): Promise<User | null> {
        const response = await apiClient.get('/auth/me');
        return normalizeUser(response.data);
    },

    /**
     * Update user profile.
     */
    async updateProfile(payload: UpdateProfilePayload): Promise<User> {
        await apiClient.put('/auth/me', payload);
        // Fetch fresh profile after update
        const response = await apiClient.get('/auth/me');
        const user = normalizeUser(response.data);
        if (!user) {
            throw new Error('Invalid user profile');
        }
        return user;
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
        } catch (error: any) {
            const status = error.response?.status;
            if (isAuthFailureStatus(status)) {
                await TokenStorage.clearTokens();
                return null;
            }
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            const refreshToken = await TokenStorage.getRefreshToken();
            if (refreshToken) {
                await apiClient.post('/auth/logout', { refreshToken });
            }
        } catch (error: any) {
            // Ignore logout API errors - we still want to clear local tokens
            console.warn('Logout API failed (session may already be invalid):', error.response?.status);
        }
        await TokenStorage.clearTokens();
    },

    /**
     * Link an email account to the current user.
     */
    async linkEmail(payload: LinkEmailPayload): Promise<void> {
        await apiClient.post('/auth/link/email', payload);
    },

    /**
     * Link a Telegram account to the current user.
     */
    async linkTelegram(payload: LinkTelegramPayload): Promise<void> {
        await apiClient.post('/auth/link/telegram', payload);
    },

    /**
     * Log out from all devices/sessions.
     */
    async logoutAll(): Promise<void> {
        try {
            await apiClient.post('/auth/logout-all');
        } catch (error: any) {
            console.warn('Logout all failed:', error.response?.status);
        }
        await TokenStorage.clearTokens();
    },
};
