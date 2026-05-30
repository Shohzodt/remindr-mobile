export const PDF_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const IMAGE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const PDF_MIME_TYPE = 'application/pdf';

export const SUPPORTED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
] as const;

export const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

export const DOCUMENT_AI_MESSAGES = {
    supportedText: 'Upload a PDF or analyze an image',
    unsupportedPdf: 'Only PDF files are supported for document upload.',
    unsupportedImage: 'Only JPG, PNG, and WEBP images are supported.',
    oversizedPdf: 'PDF must be 20MB or smaller.',
    oversizedImage: 'Image must be 10MB or smaller.',
    galleryPermission: 'Photo library permission is needed to choose an image.',
    cameraPermission: 'Camera permission is needed to take a photo.',
    genericError: 'Could not analyze this file. Please try another PDF or image.',
} as const;
