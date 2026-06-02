import type { AnalyzeVoiceReminderResponse } from '@/services/reminder-voice.service';
import type { ParsedVoiceDate, ParsedVoiceTime, VoiceReminderDraft } from './types';

export const toVoiceReminderDraft = (analysis: AnalyzeVoiceReminderResponse): VoiceReminderDraft => {
    const reminder = analysis.reminder || {};
    const title = reminder.title?.trim() || analysis.transcript.trim();
    const notes = reminder.description?.trim();

    return {
        title: title || undefined,
        notes: notes || undefined,
        date: reminder.date,
        time: reminder.time,
        category: reminder.category,
        notifyBefore: reminder.notifyBefore,
        transcript: analysis.transcript,
        confidence: analysis.confidence,
    };
};

export const parseVoiceDate = (value?: string): ParsedVoiceDate | null => {
    const [year, month, day] = (value || '').split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return { year, month, day };
};

export const parseVoiceTime = (value?: string): ParsedVoiceTime | null => {
    const [hours, minutes] = (value || '').split(':').map(Number);

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return { hours, minutes };
};
