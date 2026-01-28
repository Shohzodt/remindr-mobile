import { useState } from 'react';
import { RemindersService, CreateReminderDto } from '@/services/reminders.service';
import { Reminder } from '@/types';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/context/AuthContext';

export function useReminders() {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReminder = async (data: CreateReminderDto): Promise<Reminder | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const reminder = await RemindersService.create(data);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return reminder;
        } catch (err: any) {
            console.error('Create reminder failed', err);

            if (err.response?.status === 401) {
                // If we get a 401 here, the refresh logic in interceptor failed
                // So we must log the user out to reset state
                await logout();
                return null;
            }

            const message = err.response?.data?.message || 'Failed to create reminder';
            setError(message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createReminder,
        isLoading,
        error,
    };
}
