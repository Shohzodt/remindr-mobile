import { AxiosError } from 'axios';
import { apiClient } from './api.client';

export type VoiceReminderCategory = 'work' | 'personal' | 'social' | 'other';

export interface AnalyzeVoiceReminderAudioFile {
    uri: string;
    name: string;
    type: string;
    size?: number;
}

export interface AnalyzeVoiceReminderResult {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    category?: VoiceReminderCategory;
    notifyBefore?: number;
}

export interface AnalyzeVoiceReminderResponse {
    transcript: string;
    reminder: AnalyzeVoiceReminderResult;
    confidence: number;
}

export class AnalyzeVoiceReminderError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'AnalyzeVoiceReminderError';
        this.status = status;
    }
}

const GENERIC_VOICE_ANALYZE_ERROR = 'Could not analyze this recording. Please try again.';

const getResponseMessage = (data: any): string | null => {
    const message = data?.message || data?.error;

    if (Array.isArray(message)) {
        return message.filter(Boolean).join(' ');
    }

    return typeof message === 'string' && message.trim() ? message : null;
};

const toAnalyzeVoiceReminderError = (error: unknown): AnalyzeVoiceReminderError => {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;
    const responseMessage = getResponseMessage(axiosError.response?.data);

    return new AnalyzeVoiceReminderError(
        responseMessage || (status ? GENERIC_VOICE_ANALYZE_ERROR : axiosError.message || GENERIC_VOICE_ANALYZE_ERROR),
        status
    );
};

export const reminderVoiceApi = {
    async analyzeVoiceReminder(
        audio: AnalyzeVoiceReminderAudioFile,
        timezone: string
    ): Promise<AnalyzeVoiceReminderResponse> {
        const formData = new FormData();

        formData.append('audio', {
            uri: audio.uri,
            name: audio.name,
            type: audio.type,
        } as any);
        formData.append('timezone', timezone);

        try {
            const response = await apiClient.post<AnalyzeVoiceReminderResponse>(
                '/reminders/voice/analyze',
                formData
            );

            return {
                transcript: response.data?.transcript || '',
                reminder: response.data?.reminder || {},
                confidence: Number(response.data?.confidence ?? 0),
            };
        } catch (error) {
            if (__DEV__) {
                const axiosError = error as AxiosError<any>;
                console.warn('Voice reminder analysis upload failed', {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                    fileName: audio.name,
                    mimeType: audio.type,
                    size: audio.size,
                    timezone,
                });
            }

            throw toAnalyzeVoiceReminderError(error);
        }
    },
};
