import type { AnalyzeDocumentDate, AnalyzeDocumentFile } from '@/services/documents.service';

export type DocAiStep = 'idle' | 'picking' | 'selected' | 'analyzing' | 'success' | 'error';

export type DocAiDetectedDeadline = AnalyzeDocumentDate;

export interface SelectedDocument extends AnalyzeDocumentFile {
    fileType: 'document' | 'image';
}
