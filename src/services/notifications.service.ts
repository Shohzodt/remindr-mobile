
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from '@/types';

// Configure default handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    /**
     * Request permissions for notifications
     */
    async requestPermissions() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#e12afb',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    },

    /**
     * Schedule a notification for a reminder
     */
    async scheduleReminder(reminder: Reminder) {
        const { date, time, title, note, notifyBefore } = reminder;

        // Parse date/time
        // reminder.date is YYYY-MM-DD
        // reminder.time is HH:mm
        const triggerDate = new Date(`${date}T${time}:00`);

        // Check if date is valid
        if (isNaN(triggerDate.getTime())) {
            console.error('Invalid date/time for notification', date, time);
            return null;
        }

        // Apply notifyBefore offset (minutes)
        if (notifyBefore && notifyBefore > 0) {
            triggerDate.setMinutes(triggerDate.getMinutes() - notifyBefore);
        }

        // Don't schedule if in the past
        if (triggerDate.getTime() < Date.now()) {
            return null;
        }

        try {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: note ? note : title,
                    data: { reminderId: reminder.id },
                    sound: true,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate,
                },
                identifier: reminder.id, // Use reminder ID as notification ID for easy cancellation
            });
            return id;
        } catch (error) {
            console.error('Failed to schedule notification', error);
            return null;
        }
    },

    /**
     * Cancel a specific reminder notification
     */
    async cancelReminder(reminderId: string) {
        try {
            await Notifications.cancelScheduledNotificationAsync(reminderId);
        } catch (error) {
            console.error('Failed to cancel notification', error);
        }
    },

    async cancelAll() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    async getPending() {
        return await Notifications.getAllScheduledNotificationsAsync();
    },

    /**
     * Setup listener for notification responses (taps)
     */
    addNotificationResponseReceivedListener(onTap: (reminderId: string) => void) {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            const reminderId = data?.reminderId;
            onTap(String(reminderId));
        });
        return subscription;
    }
};
