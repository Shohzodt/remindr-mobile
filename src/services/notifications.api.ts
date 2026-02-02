import { apiClient } from './api.client';

// Types
export interface Notification {
    id: string;
    userId: string;
    reminderId: string;
    title: string;
    body: string;
    sentAt: string;
    readAt: string | null;
    createdAt: string;
}

export interface NotificationsResponse {
    data: Notification[];
    total: number;
}

export interface UnreadCountResponse {
    count: number;
}

// API Service
export const NotificationsApiService = {
    /**
     * Get all notifications for the current user
     * @param unreadOnly - If true, only returns unread notifications
     */
    async getAll(unreadOnly: boolean = false): Promise<Notification[]> {
        const params = unreadOnly ? { unreadOnly: 'true' } : {};
        const response = await apiClient.get<Notification[] | NotificationsResponse>('/notifications', { params });

        // Handle both array and wrapped object response formats
        const data = response.data;
        if (Array.isArray(data)) {
            return data;
        }
        // If wrapped in { data: [...] } format
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
            return data.data;
        }
        // Fallback to empty array
        console.warn('[NotificationsApi] Unexpected response format:', data);
        return [];
    },

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
        return response.data.count;
    },

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: string): Promise<Notification> {
        const response = await apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        await apiClient.patch('/notifications/read-all');
    },
};
