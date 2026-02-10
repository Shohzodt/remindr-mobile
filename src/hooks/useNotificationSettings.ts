import { useState, useEffect, useCallback } from 'react';
import { SettingsService, ADVANCE_WARNING_OPTIONS } from '@/services/settings.service';

interface UseNotificationSettingsReturn {
    advanceWarningMinutes: number;
    setAdvanceWarningMinutes: (minutes: number) => Promise<void>;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    options: typeof ADVANCE_WARNING_OPTIONS;
}

export const useNotificationSettings = (): UseNotificationSettingsReturn => {
    const [advanceWarningMinutes, setAdvanceWarningMinutesState] = useState<number>(15);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const settings = await SettingsService.getUserSettings();
                if (settings?.advanceWarningMinutes != null) {
                    setAdvanceWarningMinutesState(settings.advanceWarningMinutes);
                }
            } catch (err: any) {
                console.error('Failed to fetch settings:', err);
                setError(err.response?.data?.message || 'Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Update setting immediately on select
    const setAdvanceWarningMinutes = useCallback(async (minutes: number) => {
        // Optimistically update UI
        const previousValue = advanceWarningMinutes;
        setAdvanceWarningMinutesState(minutes);
        setError(null);
        setIsSaving(true);

        try {
            await SettingsService.updateUserSettings({ advanceWarningMinutes: minutes });
        } catch (err: any) {
            console.error('Failed to update settings:', err);
            // Revert on failure
            setAdvanceWarningMinutesState(previousValue);
            setError(err.response?.data?.message || 'Failed to update setting');
        } finally {
            setIsSaving(false);
        }
    }, [advanceWarningMinutes]);

    return {
        advanceWarningMinutes,
        setAdvanceWarningMinutes,
        isLoading,
        isSaving,
        error,
        options: ADVANCE_WARNING_OPTIONS,
    };
};
