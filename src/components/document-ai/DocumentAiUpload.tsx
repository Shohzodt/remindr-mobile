import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { AlertCircle, Camera, FileImage, FileText, Trash2, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DOCUMENT_AI_MESSAGES } from '@/constants/document-ai';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';
import { formatFileSize } from '@/utils/document-ai';
import { DocumentAiSourceAction } from './DocumentAiSourceAction';
import type { DocAiStep, SelectedDocument } from './types';

interface DocumentAiUploadProps {
    step: DocAiStep;
    selectedFile: SelectedDocument | null;
    errorMessage: string | null;
    isBusy: boolean;
    onClose: () => void;
    onPickDocument: () => void;
    onChooseImage: () => void;
    onTakePhoto: () => void;
    onAnalyzeDocument: () => void;
    onRemoveSelected: () => void;
}

export function DocumentAiUpload({
    step,
    selectedFile,
    errorMessage,
    isBusy,
    onClose,
    onPickDocument,
    onChooseImage,
    onTakePhoto,
    onAnalyzeDocument,
    onRemoveSelected,
}: DocumentAiUploadProps) {
    const hasSelectedFile = Boolean(selectedFile);
    const fileSize = formatFileSize(selectedFile?.size);
    const selectedLabel = selectedFile?.fileType === 'image' ? 'Image' : 'PDF';

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
                    {DOCUMENT_AI_MESSAGES.supportedText}
                </Text>
            </View>

            <View className="mb-5 gap-3">
                <DocumentAiSourceAction
                    icon={<FileText size={20} color="#ffffff" />}
                    title="Upload PDF"
                    subtitle="Choose a PDF document"
                    disabled={isBusy}
                    onPress={onPickDocument}
                />
                <DocumentAiSourceAction
                    icon={<FileImage size={20} color="#ffffff" />}
                    title="Choose image"
                    subtitle="Use a JPG, PNG, or WEBP from gallery"
                    disabled={isBusy}
                    onPress={onChooseImage}
                />
                <DocumentAiSourceAction
                    icon={<Camera size={20} color="#ffffff" />}
                    title="Take photo"
                    subtitle="Capture one image with camera"
                    disabled={isBusy}
                    onPress={onTakePhoto}
                />
            </View>

            {hasSelectedFile ? (
                <View className="mb-5 flex-row items-center gap-4 rounded-[24px] border border-accent-purple/40 bg-accent-purple/10 p-4">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-purple">
                        {selectedFile?.fileType === 'image' ? (
                            <FileImage size={22} color="#ffffff" />
                        ) : (
                            <FileText size={22} color="#ffffff" />
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-sm font-sans-extrabold text-white" numberOfLines={1}>
                            {selectedFile?.name}
                        </Text>
                        <Text variant="micro" className="mt-1 text-[#a78bfa] text-[9px] tracking-[0.16em]">
                            {fileSize ? `${selectedLabel} - ${fileSize}` : selectedLabel}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onRemoveSelected}
                        activeOpacity={0.8}
                        disabled={isBusy}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                    >
                        <Trash2 size={17} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            ) : null}

            {step === 'picking' ? (
                <View className="mb-5 flex-row items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <ActivityIndicator color={Theme.colors.accentPurple} />
                    <Text className="text-sm font-sans-bold text-[#a1a1aa]">
                        Opening picker...
                    </Text>
                </View>
            ) : null}

            {step === 'error' && errorMessage ? (
                <View className="mb-5 flex-row items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle size={18} color="#f87171" />
                    <View className="flex-1">
                        <Text className="text-sm font-sans-bold leading-5 text-red-100">
                            {errorMessage}
                        </Text>
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
                            Analyze file
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            ) : (
                <View className="mb-4 h-16 items-center justify-center rounded-[24px] border border-white/5 bg-white/[0.04]">
                    <Text className="text-base font-sans-extrabold text-[#3f3f46]">
                        Analyze file
                    </Text>
                </View>
            )}
        </>
    );
}
