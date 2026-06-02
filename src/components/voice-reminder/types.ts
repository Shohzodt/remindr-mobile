import type { VoiceReminderCategory } from '@/services/reminder-voice.service';

export interface VoiceReminderDraft {
    title?: string;
    notes?: string;
    date?: string;
    time?: string;
    category?: VoiceReminderCategory;
    notifyBefore?: number;
    transcript: string;
    confidence: number;
}

export interface ParsedVoiceDate {
    year: number;
    month: number;
    day: number;
}

export interface ParsedVoiceTime {
    hours: number;
    minutes: number;
}
