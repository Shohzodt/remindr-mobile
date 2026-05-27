import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Modal,
    Pressable,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle, Check, FileText, Plus, Sparkles, UploadCloud, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DocumentsService, type AnalyzeDocumentDate, type AnalyzeDocumentFile, type AnalyzeDocumentResponse } from '@/services/documents.service';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';

type DocAiStep = 'idle' | 'picking' | 'selected' | 'analyzing' | 'success' | 'error';

export type DocAiDetectedDeadline = AnalyzeDocumentDate;

interface SelectedDocument extends AnalyzeDocumentFile {
    size?: number;
}

interface DocumentAiSheetProps {
    visible: boolean;
    onClose: () => void;
    onCreateReminder: (deadline: DocAiDetectedDeadline, sourceFileName: string) => void;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;
const SUPPORTED_TEXT = 'PDF, JPG, PNG, or WEBP up to 20MB';
const UNSUPPORTED_FILE_MESSAGE = 'Only PDF, JPG, PNG, and WEBP files are supported.';
const OVERSIZED_FILE_MESSAGE = 'File must be 20MB or smaller.';
const GENERIC_ERROR_MESSAGE = 'Could not analyze this file. Please try another PDF or image.';

const MIME_TYPE_BY_EXTENSION: Record<string, SelectedDocument['type']> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
};

const getFileExtension = (fileName: string) => {
    const parts = fileName.toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() || '' : '';
};

const resolveMimeType = (asset: DocumentPicker.DocumentPickerAsset) => {
    const mimeType = asset.mimeType || MIME_TYPE_BY_EXTENSION[getFileExtension(asset.name)];
    return mimeType || '';
};

const isAllowedMimeType = (mimeType: string) => {
    return ALLOWED_MIME_TYPES.includes(mimeType as typeof ALLOWED_MIME_TYPES[number]);
};

const formatFileSize = (size?: number) => {
    if (!size) return null;

    const mb = size / (1024 * 1024);
    return `${mb >= 1 ? mb.toFixed(1) : '<1'} MB`;
};

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
                type: [...ALLOWED_MIME_TYPES],
                multiple: false,
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                setStep(selectedFile ? 'selected' : 'idle');
                return;
            }

            const asset = result.assets?.[0];
            if (!asset) {
                showError(GENERIC_ERROR_MESSAGE);
                return;
            }

            const type = resolveMimeType(asset);

            if (!isAllowedMimeType(type)) {
                showError(UNSUPPORTED_FILE_MESSAGE);
                return;
            }

            if (typeof asset.size === 'number' && asset.size > MAX_FILE_SIZE_BYTES) {
                showError(OVERSIZED_FILE_MESSAGE);
                return;
            }

            setSelectedFile({
                uri: asset.uri,
                name: asset.name,
                type,
                size: asset.size,
            });
            setAnalysis(null);
            setStep('selected');
        } catch (error) {
            console.warn('Document picker failed', error);
            showError(GENERIC_ERROR_MESSAGE);
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
            showError(error?.message || GENERIC_ERROR_MESSAGE, true);
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
                        <AnalyzingState onClose={close} />
                    ) : step === 'success' ? (
                        <SuccessState
                            analysis={analysis}
                            reportScrollMaxHeight={reportScrollMaxHeight}
                            onClose={close}
                            onRescan={reset}
                            onCreateReminder={handleCreateReminder}
                        />
                    ) : (
                        <UploadState
                            step={step}
                            selectedFile={selectedFile}
                            errorMessage={errorMessage}
                            isBusy={isBusy}
                            onClose={close}
                            onPickDocument={pickDocument}
                            onAnalyzeDocument={analyzeSelectedDocument}
                            onClearError={() => {
                                setErrorMessage(null);
                                setStep(selectedFile ? 'selected' : 'idle');
                            }}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

interface UploadStateProps {
    step: DocAiStep;
    selectedFile: SelectedDocument | null;
    errorMessage: string | null;
    isBusy: boolean;
    onClose: () => void;
    onPickDocument: () => void;
    onAnalyzeDocument: () => void;
    onClearError: () => void;
}

function UploadState({
    step,
    selectedFile,
    errorMessage,
    isBusy,
    onClose,
    onPickDocument,
    onAnalyzeDocument,
    onClearError,
}: UploadStateProps) {
    const hasSelectedFile = Boolean(selectedFile);
    const fileSize = formatFileSize(selectedFile?.size);

    return (
        <>
            <View className="mb-6 h-10 items-end">
                <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <X size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View className="mb-8 items-center">
                <Text className="text-[32px] font-sans-extrabold text-white">
                    Document AI
                </Text>
                <Text className="mt-2 text-sm font-sans-bold text-[#8b8b95]">
                    {SUPPORTED_TEXT}
                </Text>
            </View>

            <Pressable
                disabled={isBusy}
                onPress={onPickDocument}
                className={`mb-5 min-h-[190px] items-center justify-center rounded-[28px] border-2 px-6 ${hasSelectedFile
                    ? 'border-accent-purple bg-accent-purple/5'
                    : 'border-[#3a3a42] bg-white/[0.03]'
                    }`}
                style={{ borderStyle: 'dashed', opacity: isBusy ? 0.72 : 1 }}
            >
                <View className={`mb-5 h-20 w-20 items-center justify-center rounded-[24px] ${hasSelectedFile ? 'bg-accent-purple' : 'bg-white/[0.04]'}`}>
                    {step === 'picking' ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : hasSelectedFile ? (
                        <Check size={34} color="#ffffff" strokeWidth={3} />
                    ) : (
                        <UploadCloud size={32} color="#71717a" />
                    )}
                </View>

                <Text variant="micro" className="mb-2 text-center text-white/80 text-[11px] tracking-[0.2em]">
                    {step === 'picking'
                        ? 'OPENING FILE PICKER'
                        : selectedFile?.name || 'TAP TO SELECT FILE'}
                </Text>
                <Text variant="micro" className="text-center text-[#52525b] text-[9px] tracking-[0.08em]">
                    {fileSize ? `${fileSize} - ${SUPPORTED_TEXT}` : SUPPORTED_TEXT}
                </Text>
            </Pressable>

            {step === 'error' && errorMessage ? (
                <View className="mb-5 flex-row items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle size={18} color="#f87171" />
                    <View className="flex-1">
                        <Text className="text-sm font-sans-bold leading-5 text-red-100">
                            {errorMessage}
                        </Text>
                        {selectedFile ? (
                            <TouchableOpacity onPress={onClearError} activeOpacity={0.8} className="mt-3 self-start">
                                <Text className="text-xs font-sans-extrabold uppercase tracking-[0.15em] text-red-200">
                                    Keep selected file
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            ) : null}

            {hasSelectedFile ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onAnalyzeDocument}
                    disabled={isBusy}
                    className="mb-4 h-16 overflow-hidden rounded-[24px]"
                >
                    <LinearGradient
                        colors={['#e12afb', '#9810fa']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isBusy ? 0.68 : 1,
                        }}
                    >
                        <Text className="text-base font-sans-extrabold text-white">
                            Analyze document
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPickDocument}
                    disabled={isBusy}
                    className="mb-4 h-16 overflow-hidden rounded-[24px]"
                >
                    <LinearGradient
                        colors={['#e12afb', '#9810fa']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isBusy ? 0.68 : 1,
                        }}
                    >
                        <Text className="text-base font-sans-extrabold text-white">
                            Analyze document
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </>
    );
}

function AnalyzingState({ onClose }: { onClose: () => void }) {
    return (
        <>
            <View className="mb-6 h-10 items-end">
                <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <X size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View className="min-h-[420px] items-center justify-center">
                <ScanningIndicator />

                <Text className="text-[28px] font-sans-extrabold text-white">
                    Analyzing document...
                </Text>
                <Text className="mt-3 text-sm font-sans-bold text-[#71717a]">
                    Looking for reminder-worthy dates.
                </Text>
            </View>
        </>
    );
}

interface SuccessStateProps {
    analysis: AnalyzeDocumentResponse | null;
    reportScrollMaxHeight: number;
    onClose: () => void;
    onRescan: () => void;
    onCreateReminder: (deadline: DocAiDetectedDeadline) => void;
}

function SuccessState({
    analysis,
    reportScrollMaxHeight,
    onClose,
    onRescan,
    onCreateReminder,
}: SuccessStateProps) {
    const dates = analysis?.dates || [];

    return (
        <>
            <View className="mb-7 flex-row items-center justify-between">
                <View className="rounded-xl bg-accent-purple/15 px-3 py-1.5">
                    <Text variant="micro" className="text-accent-purple text-[9px] tracking-[0.25em]">
                        AI REPORT
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <X size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                nestedScrollEnabled
                bounces
                alwaysBounceVertical={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: reportScrollMaxHeight }}
                contentContainerStyle={{ paddingBottom: 8 }}
            >
                <Text className="mb-6 text-[34px] font-sans-extrabold leading-[38px] text-white">
                    Analysis Complete
                </Text>

                <View className="mb-8 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <Text className="text-sm font-sans-medium leading-6 text-[#a1a1aa]">
                        {analysis?.summary || 'No summary was returned for this file.'}
                    </Text>
                </View>

                <Text variant="micro" className="mb-4 pl-1 text-[#71717a] tracking-[0.25em]">
                    DETECTED DATES
                </Text>

                {dates.length === 0 ? (
                    <View className="items-center rounded-[28px] border border-white/10 bg-card p-6">
                        <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]">
                            <FileText size={22} color="#71717a" />
                        </View>
                        <Text className="text-center text-sm font-sans-bold leading-6 text-[#a1a1aa]">
                            No reminder-worthy dates found.
                        </Text>
                    </View>
                ) : (
                    <View className="gap-5">
                        {dates.map((deadline, index) => (
                            <View
                                key={`${deadline.date}-${deadline.title}-${index}`}
                                className="rounded-[28px] border border-white/10 bg-card p-5"
                            >
                                <Text className="mb-2 text-base font-sans-extrabold text-accent-purple">
                                    {deadline.date}
                                </Text>
                                <Text className="mb-5 text-xl font-sans-extrabold text-white">
                                    {deadline.title}
                                </Text>
                                <Text className="mb-7 text-sm font-sans-medium leading-6 text-[#8b8b95]">
                                    {deadline.description}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => onCreateReminder(deadline)}
                                    className="h-12 flex-row items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04]"
                                >
                                    <Plus size={16} color="#ffffff" />
                                    <Text className="text-xs font-sans-extrabold uppercase tracking-[0.15em] text-white">
                                        Create Reminder
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={onRescan}
                    className="mt-6 h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                >
                    <Text className="text-sm font-sans-extrabold text-white">
                        Rescan
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

function ScanningIndicator() {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1100,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => {
            animation.stop();
            spinValue.setValue(0);
        };
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View className="mb-8 h-28 w-28 items-center justify-center">
            <Animated.View
                className="absolute inset-0 rounded-full border-4 border-white"
                style={{ transform: [{ rotate: spin }] }}
            >
                <View className="absolute bottom-0 right-1 h-9 w-9 rounded-full bg-accent-purple" />
            </Animated.View>

            <View className="h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
                <Sparkles size={28} color={Theme.colors.accentPurple} />
            </View>
        </View>
    );
}
