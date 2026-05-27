import { AxiosError } from 'axios';
import { HttpStatusCode } from '@/constants/http';
import { apiClient } from './api.client';

export interface AnalyzeDocumentFile {
    uri: string;
    name: string;
    type: string;
}

export interface AnalyzeDocumentDate {
    title: string;
    date: string;
    description: string;
}

export interface AnalyzeDocumentResponse {
    summary: string;
    dates: AnalyzeDocumentDate[];
}

export class AnalyzeDocumentError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'AnalyzeDocumentError';
        this.status = status;
    }
}

const GENERIC_ANALYZE_ERROR = 'Could not analyze this file. Please try another PDF or image.';

const getResponseMessage = (data: any): string | null => {
    const message = data?.message || data?.error;

    if (Array.isArray(message)) {
        return message.filter(Boolean).join(' ');
    }

    return typeof message === 'string' && message.trim() ? message : null;
};

const toAnalyzeDocumentError = (error: unknown): AnalyzeDocumentError => {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;

    if (status === HttpStatusCode.PAYLOAD_TOO_LARGE) {
        return new AnalyzeDocumentError('File must be 20MB or smaller.', status);
    }

    if (status === HttpStatusCode.BAD_REQUEST) {
        return new AnalyzeDocumentError(
            getResponseMessage(axiosError.response?.data) || GENERIC_ANALYZE_ERROR,
            status
        );
    }

    if (
        status === HttpStatusCode.INTERNAL_SERVER_ERROR ||
        status === HttpStatusCode.SERVICE_UNAVAILABLE
    ) {
        return new AnalyzeDocumentError(GENERIC_ANALYZE_ERROR, status);
    }

    return new AnalyzeDocumentError(
        getResponseMessage(axiosError.response?.data) ||
        axiosError.message ||
        'Failed to analyze document. Please try again.',
        status
    );
};

export const DocumentsService = {
    async analyzeDocument(file: AnalyzeDocumentFile): Promise<AnalyzeDocumentResponse> {
        const formData = new FormData();

        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);

        try {
            const response = await apiClient.post<AnalyzeDocumentResponse>(
                '/documents/analyze',
                formData
            );

            return {
                summary: response.data?.summary || '',
                dates: Array.isArray(response.data?.dates) ? response.data.dates : [],
            };
        } catch (error) {
            throw toAnalyzeDocumentError(error);
        }
    },
};
