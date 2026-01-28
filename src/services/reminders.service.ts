import { apiClient } from './api.client';
import { Reminder } from '@/types';

export interface CreateReminderDto {
    title: string;
    note?: string;
    location?: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    category: string;
    priority: string;
    isProtected: boolean;
    notifyBefore: number;
    status: string;
    source: string;
}

export const RemindersService = {
    /**
     * Create a new reminder
     */
    async create(data: CreateReminderDto): Promise<Reminder> {
        const response = await apiClient.post<Reminder>('/reminders', data);
        return response.data;
    },

    /**
     * Get all reminders (Basic implementation for future use)
     */
    async getAll(): Promise<Reminder[]> {
        const response = await apiClient.get<Reminder[]>('/reminders');
        return response.data;
    },

    /**
     * Delete a reminder
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/reminders/${id}`);
    },

    /**
     * Update a reminder
     */
    async update(id: string, data: Partial<CreateReminderDto>): Promise<Reminder> {
        const response = await apiClient.patch<Reminder>(`/reminders/${id}`, data);
        return response.data;
    }
};
