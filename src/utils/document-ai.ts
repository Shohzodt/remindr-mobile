import type * as DocumentPicker from 'expo-document-picker';
import type * as ImagePicker from 'expo-image-picker';
import { PDF_MIME_TYPE, SUPPORTED_IMAGE_MIME_TYPES } from '@/constants/document-ai';

export type SupportedImageMimeType = typeof SUPPORTED_IMAGE_MIME_TYPES[number];

const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
    pdf: PDF_MIME_TYPE,
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
};

const IMAGE_EXTENSION_BY_MIME_TYPE: Record<SupportedImageMimeType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

export const getFileExtension = (fileNameOrUri: string) => {
    const fileName = fileNameOrUri.split('?')[0]?.split('#')[0] || fileNameOrUri;
    const parts = fileName.toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() || '' : '';
};

export const formatFileSize = (size?: number) => {
    if (!size) return null;

    const mb = size / (1024 * 1024);
    return `${mb >= 1 ? mb.toFixed(1) : '<1'} MB`;
};

export const resolveDocumentMimeType = (asset: DocumentPicker.DocumentPickerAsset) => {
    const mimeType = asset.mimeType || MIME_TYPE_BY_EXTENSION[getFileExtension(asset.name)];
    return mimeType || '';
};

export const isBackendSupportedImage = (mimeType: string): mimeType is SupportedImageMimeType => {
    return SUPPORTED_IMAGE_MIME_TYPES.includes(mimeType as SupportedImageMimeType);
};

export const normalizeImageMimeType = (asset: ImagePicker.ImagePickerAsset): SupportedImageMimeType | null => {
    const name = asset.fileName || asset.uri;
    const mimeType = asset.mimeType || MIME_TYPE_BY_EXTENSION[getFileExtension(name)] || '';

    if (mimeType === 'image/jpg') {
        return 'image/jpeg';
    }

    return isBackendSupportedImage(mimeType) ? mimeType : null;
};

export const getSafeImageUploadName = (_asset: ImagePicker.ImagePickerAsset, mimeType: SupportedImageMimeType) => {
    return `reminder-image-${Date.now()}.${IMAGE_EXTENSION_BY_MIME_TYPE[mimeType]}`;
};

export const getCameraPhotoUploadName = () => {
    return `reminder-photo-${Date.now()}.jpg`;
};
