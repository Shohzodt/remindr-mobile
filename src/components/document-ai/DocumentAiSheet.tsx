import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    useWindowDimensions,
    View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocumentsService, type AnalyzeDocumentResponse } from '@/services/documents.service';
import {
    DOCUMENT_AI_MESSAGES,
    IMAGE_MAX_FILE_SIZE_BYTES,
    PDF_MAX_FILE_SIZE_BYTES,
    PDF_MIME_TYPE,
} from '@/constants/document-ai';
import {
    getCameraPhotoUploadName,
    getSafeImageUploadName,
    normalizeImageMimeType,
    resolveDocumentMimeType,
} from '@/utils/document-ai';
import { DocumentAnalyzing } from './DocumentAnalyzing';
import { DocumentAiSummary } from './DocumentAiSummary';
import { DocumentAiUpload } from './DocumentAiUpload';
import type { DocAiDetectedDeadline, DocAiStep, SelectedDocument } from './types';

interface DocumentAiSheetProps {
    visible: boolean;
    onClose: () => void;
    onCreateReminder: (deadline: DocAiDetectedDeadline, sourceFileName: string) => void;
}

export const DocumentAiSheet = ({ visible, onClose, onCreateReminder }: DocumentAiSheetProps) => {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const [step, setStep] = useState<DocAiStep>('idle');
    const [selectedFile, setSelectedFile] = useState<SelectedDocument | null>(null);
    const [analysis, setAnalysis] = useState<AnalyzeDocumentResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const sheetMaxHeight = height * 0.88;
    const reportScrollMaxHeight = sheetMaxHeight - Math.max(insets.bottom, 28) - 96;
    const isBusy = step === 'picking' || step === 'analyzing';

    const reset = () => {
        setStep('idle');
        setSelectedFile(null);
        setAnalysis(null);
        setErrorMessage(null);
    };

    const close = () => {
        onClose();
        reset();
    };

    const showError = (message: string, keepSelectedFile = false) => {
        setErrorMessage(message);
        setAnalysis(null);
        if (!keepSelectedFile) {
            setSelectedFile(null);
        }
        setStep('error');
    };

    const pickDocument = async () => {
        if (isBusy) return;

        setStep('picking');
        setErrorMessage(null);

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: PDF_MIME_TYPE,
                multiple: false,
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                setStep(selectedFile ? 'selected' : 'idle');
                return;
            }

            const asset = result.assets?.[0];
            if (!asset) {
                showError(DOCUMENT_AI_MESSAGES.genericError);
                return;
            }

            const type = resolveDocumentMimeType(asset);

            if (type !== PDF_MIME_TYPE) {
                showError(DOCUMENT_AI_MESSAGES.unsupportedPdf);
                return;
            }

            if (typeof asset.size === 'number' && asset.size > PDF_MAX_FILE_SIZE_BYTES) {
                showError(DOCUMENT_AI_MESSAGES.oversizedPdf);
                return;
            }

            setSelectedFile({
                uri: asset.uri,
                name: asset.name,
                type,
                size: asset.size,
                fileType: 'document',
            });
            setAnalysis(null);
            setStep('selected');
        } catch (error) {
            console.warn('Document picker failed', error);
            showError(DOCUMENT_AI_MESSAGES.genericError);
        }
    };

    const chooseImage = async () => {
        if (isBusy) return;

        setStep('picking');
        setErrorMessage(null);

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                showError(DOCUMENT_AI_MESSAGES.galleryPermission);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: false,
                quality: 1,
            });

            if (result.canceled) {
                setStep(selectedFile ? 'selected' : 'idle');
                return;
            }

            const asset = result.assets?.[0];
            if (!asset) {
                showError(DOCUMENT_AI_MESSAGES.genericError);
                return;
            }

            const type = normalizeImageMimeType(asset);
            if (!type) {
                showError(DOCUMENT_AI_MESSAGES.unsupportedImage);
                return;
            }

            if (typeof asset.fileSize === 'number' && asset.fileSize > IMAGE_MAX_FILE_SIZE_BYTES) {
                showError(DOCUMENT_AI_MESSAGES.oversizedImage);
                return;
            }

            setSelectedFile({
                uri: asset.uri,
                name: getSafeImageUploadName(asset, type),
                type,
                size: asset.fileSize,
                fileType: 'image',
            });
            setAnalysis(null);
            setStep('selected');
        } catch (error) {
            console.warn('Image picker failed', error);
            showError(DOCUMENT_AI_MESSAGES.genericError);
        }
    };

    const takePhoto = async () => {
        if (isBusy) return;

        setStep('picking');
        setErrorMessage(null);

        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                showError(DOCUMENT_AI_MESSAGES.cameraPermission);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.85,
            });

            if (result.canceled) {
                setStep(selectedFile ? 'selected' : 'idle');
                return;
            }

            const asset = result.assets?.[0];
            if (!asset) {
                showError(DOCUMENT_AI_MESSAGES.genericError);
                return;
            }

            const type = 'image/jpeg';

            if (typeof asset.fileSize === 'number' && asset.fileSize > IMAGE_MAX_FILE_SIZE_BYTES) {
                showError(DOCUMENT_AI_MESSAGES.oversizedImage);
                return;
            }

            setSelectedFile({
                uri: asset.uri,
                name: getCameraPhotoUploadName(),
                type,
                size: asset.fileSize,
                fileType: 'image',
            });
            setAnalysis(null);
            setStep('selected');
        } catch (error) {
            console.warn('Camera picker failed', error);
            showError(DOCUMENT_AI_MESSAGES.genericError);
        }
    };

    const analyzeSelectedDocument = async () => {
        if (!selectedFile || step === 'analyzing') return;

        setStep('analyzing');
        setErrorMessage(null);

        try {
            const result = await DocumentsService.analyzeDocument(selectedFile);
            setAnalysis(result);
            setStep('success');
        } catch (error: any) {
            console.warn('Document analysis failed', error);
            showError(error?.message || DOCUMENT_AI_MESSAGES.genericError, true);
        }
    };

    const handleCreateReminder = (deadline: DocAiDetectedDeadline) => {
        if (!selectedFile) return;
        onCreateReminder(deadline, selectedFile.name);
        reset();
    };

    useEffect(() => {
        if (!visible) {
            reset();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={close}
        >
            <View className="flex-1 justify-end bg-black/75">
                <Pressable className="absolute inset-0" onPress={close} />

                <View
                    className="rounded-t-[34px] border border-white/10 bg-[#111114] px-6 pt-5 pb-8"
                    style={{
                        maxHeight: sheetMaxHeight,
                        paddingBottom: Math.max(insets.bottom, 28),
                    }}
                >
                    {step === 'analyzing' ? (
                        <DocumentAnalyzing onClose={close} />
                    ) : step === 'success' ? (
                        <DocumentAiSummary
                            analysis={analysis}
                            reportScrollMaxHeight={reportScrollMaxHeight}
                            onClose={close}
                            onRescan={reset}
                            onCreateReminder={handleCreateReminder}
                        />
                    ) : (
                        <DocumentAiUpload
                            step={step}
                            selectedFile={selectedFile}
                            errorMessage={errorMessage}
                            isBusy={isBusy}
                            onClose={close}
                            onPickDocument={pickDocument}
                            onChooseImage={chooseImage}
                            onTakePhoto={takePhoto}
                            onAnalyzeDocument={analyzeSelectedDocument}
                            onRemoveSelected={() => {
                                setSelectedFile(null);
                                setAnalysis(null);
                                setErrorMessage(null);
                                setStep('idle');
                            }}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};
