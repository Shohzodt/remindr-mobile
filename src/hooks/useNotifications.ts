import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsApiService, Notification } from '@/services/notifications.api';
import * as Haptics from 'expo-haptics';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];
export const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count'];

/**
 * Hook for fetching and managing notifications
 */
export function useNotifications(unreadOnly: boolean = false) {
    const queryClient = useQueryClient();

    // Fetch notifications
    const {
        data: notifications = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: [...NOTIFICATIONS_QUERY_KEY, { unreadOnly }],
        queryFn: () => NotificationsApiService.getAll(unreadOnly),
    });

    // Mark single notification as read
    const markAsReadMutation = useMutation({
        mutationFn: (notificationId: string) => NotificationsApiService.markAsRead(notificationId),
        onSuccess: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Invalidate both lists and unread count
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
        },
        onError: (err) => {
            console.error('Failed to mark notification as read:', err);
        },
    });

    // Mark all as read
    const markAllAsReadMutation = useMutation({
        mutationFn: () => NotificationsApiService.markAllAsRead(),
        onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
        },
        onError: (err) => {
            console.error('Failed to mark all as read:', err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });

    return {
        notifications,
        isLoading,
        isFetching,
        error: (error as any)?.message || null,
        refetch,
        markAsRead: (id: string) => markAsReadMutation.mutate(id),
        markAllAsRead: () => markAllAsReadMutation.mutate(),
        isMarkingAsRead: markAsReadMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
    };
}

/**
 * Hook for fetching unread notification count (for badge display)
 */
export function useUnreadCount() {
    const {
        data: count = 0,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: UNREAD_COUNT_QUERY_KEY,
        queryFn: () => NotificationsApiService.getUnreadCount(),
        // Refetch frequently for up-to-date badge
        refetchInterval: 30000, // 30 seconds
        staleTime: 10000, // 10 seconds
    });

    return {
        count,
        isLoading,
        error: (error as any)?.message || null,
        refetch,
    };
}
