import { apiClient } from './api.client';
import { TokenStorage } from './storage';
import { TelegramAuthService } from './telegramAuth.service';
import { User } from '../types/user';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const AuthService = {
    /**
     * Login with Google ID Token.
     */
    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/google', { token: idToken });
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
    async loginWithTelegram(data: any): Promise<AuthResponse> {
        return TelegramAuthService.completeAuth(data.code);
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
            await TokenStorage.setTokens(newAccessToken, newRefreshToken);

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
