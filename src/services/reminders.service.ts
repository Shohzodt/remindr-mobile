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

export interface FixTimingResponse {
    reminderId: string;
    scheduledAt: string;
    previousScheduledAt: string;
    confidence: 'high' | 'medium' | 'low';
    reasonCode: 'NEXT_WINDOW' | 'DEADLINE_CONSTRAINED' | 'WEEKEND_SHIFT' | 'INTERRUPTION_AVOIDED' | 'ESCALATED';
    risk: boolean;
    engineVersion: number;
}

export interface FixTimingPayload {
    timezone?: string;
}

export type GuardianStatusTone = 'success' | 'warning' | 'danger' | 'info';

export interface GuardianSummaryItem {
    title?: string;
    status?: GuardianStatusTone;
}

export interface GuardianSummaryBlock {
    title?: string;
    description?: string;
    items?: GuardianSummaryItem[];
}

export interface GuardianContextBlock {
    title?: string;
    description?: string;
    status?: GuardianStatusTone;
}

export interface GuardianContent {
    id?: string;
    reminderId?: string;
    status?: string;
    title?: string;
    deadlineAt?: string | null;
    isProtected?: boolean;
    summary?: GuardianSummaryBlock | null;
    context?: GuardianContextBlock | null;
    locked?: boolean;
    isLocked?: boolean;
    upsellTitle?: string;
    upsellSummary?: string;
    ctaLabel?: string;
}

export interface GuardianTimelineItem extends Omit<Partial<Reminder>, 'status'>, GuardianContent {
    id: string;
}

export interface GuardianTimelineResponse {
    items: GuardianTimelineItem[];
    locked: boolean;
    title?: string;
    summary?: string;
    status?: string;
    upsellTitle?: string;
    upsellSummary?: string;
    ctaLabel?: string;
}

const isLockedGuardianPayload = (payload: any) => {
    return Boolean(payload?.locked || payload?.isLocked || payload?.status === 'locked');
};

const unwrapGuardianItems = (payload: any): GuardianTimelineItem[] => {
    const items = Array.isArray(payload)
        ? payload
        : payload?.items || payload?.reminders || payload?.data || [];

    return Array.isArray(items) ? items : [];
};

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
        return response.data || [];
    },

    /**
     * Get a single reminder
     */
    async getOne(id: string): Promise<Reminder> {
        const response = await apiClient.get<Reminder>(`/reminders/${id}`);
        return response.data;
    },

    /**
     * Get Reminder Guardian cards for the Timeline section.
     */
    async getGuardianTimeline(): Promise<GuardianTimelineResponse> {
        const response = await apiClient.get('/reminders/guardian');
        const data = response.data || {};

        return {
            items: unwrapGuardianItems(data),
            locked: isLockedGuardianPayload(data),
            title: data.title,
            summary: data.summary,
            status: data.status,
            upsellTitle: data.upsellTitle,
            upsellSummary: data.upsellSummary,
            ctaLabel: data.ctaLabel,
        };
    },

    /**
     * Get dedicated Reminder Guardian detail content for a single reminder.
     */
    async getGuardianDetail(id: string): Promise<GuardianContent> {
        const response = await apiClient.get<GuardianContent>(`/reminders/${id}/guardian`);
        return response.data || {};
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
    },

    /**
     * Ask Smart Timing v1 to move a reminder to a better time.
     */
    async fixTiming(id: string, payload: FixTimingPayload = {}): Promise<FixTimingResponse> {
        const response = await apiClient.post<FixTimingResponse>(`/reminders/${id}/fix-timing`, payload);
        return response.data;
    }
};
