import { apiClient } from './api.client';
import { UserSettings, UpdateUserSettingsPayload } from '@/types';

/**
 * Advance warning options in minutes
 */
export const ADVANCE_WARNING_OPTIONS = [
    { label: '5m', value: 5 },
    { label: '15m', value: 15 },
    { label: '1h', value: 60 },
    { label: '1d', value: 1440 },
] as const;

export const SettingsService = {
    /**
     * Get current user settings
     */
    async getUserSettings(): Promise<UserSettings> {
        const response = await apiClient.get<UserSettings>('/user/settings');
        return response.data;
    },

    /**
     * Update user settings
     */
    async updateUserSettings(payload: UpdateUserSettingsPayload): Promise<UserSettings> {
        const response = await apiClient.patch<UserSettings>('/user/settings', payload);
        return response.data;
    },
};
