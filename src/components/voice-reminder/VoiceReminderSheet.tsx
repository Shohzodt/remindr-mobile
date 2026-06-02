import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, Check, Mic, RotateCcw, Square, X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import {
    AnalyzeVoiceReminderResponse,
    reminderVoiceApi,
} from '@/services/reminder-voice.service';
import { Theme } from '@/theme';
import type { VoiceReminderDraft } from './types';
import { toVoiceReminderDraft } from './utils';

type VoiceReminderStep = 'idle' | 'requestingPermission' | 'recording' | 'uploading' | 'success' | 'error';

interface VoiceReminderSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (draft: VoiceReminderDraft) => void;
}

const EMPTY_TRANSCRIPT_ERROR = 'We could not detect speech in this recording. Please try again.';
const GENERIC_UPLOAD_ERROR = 'Could not analyze this recording. Please try again.';
const VOICE_RECORDING_MAX_SECONDS = 30;

const getTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
        return 'UTC';
    }
};

const formatElapsed = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
};

const formatConfidence = (confidence: number) => {
    if (!Number.isFinite(confidence)) return '0%';
    const normalized = confidence <= 1 ? confidence * 100 : confidence;
    return `${Math.round(Math.max(0, Math.min(normalized, 100)))}%`;
};

export const VoiceReminderSheet = ({ visible, onClose, onApply }: VoiceReminderSheetProps) => {
    const {
        requestPermission,
        startRecording,
        stopRecording,
        cancelRecording,
        elapsedSeconds,
        errorMessage: recorderError,
    } = useVoiceRecorder();
    const [step, setStep] = useState<VoiceReminderStep>('idle');
    const [analysis, setAnalysis] = useState<AnalyzeVoiceReminderResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const isStoppingRecordingRef = useRef(false);

    const detectedFields = useMemo(() => {
        if (!analysis?.reminder) return [];

        return [
            ['Title', analysis.reminder.title],
            ['Notes', analysis.reminder.description],
            ['Date', analysis.reminder.date],
            ['Time', analysis.reminder.time],
            ['Category', analysis.reminder.category],
            ['Notify before', typeof analysis.reminder.notifyBefore === 'number' ? `${analysis.reminder.notifyBefore} min` : undefined],
        ].filter(([, value]) => typeof value === 'string' && value.trim());
    }, [analysis]);

    useEffect(() => {
        if (!visible) {
            isStoppingRecordingRef.current = false;
            setStep('idle');
            setAnalysis(null);
            setErrorMessage(null);
            cancelRecording().catch(() => undefined);
            return;
        }

        isStoppingRecordingRef.current = false;
        setStep('requestingPermission');
        requestPermission()
            .then((granted) => {
                setStep(granted ? 'idle' : 'error');
                setErrorMessage(granted ? null : 'Microphone permission is needed to record a reminder.');
            })
            .catch(() => {
                setStep('error');
                setErrorMessage('Microphone permission is needed to record a reminder.');
            });
    }, [cancelRecording, requestPermission, visible]);

    const resetForRetry = () => {
        isStoppingRecordingRef.current = false;
        setAnalysis(null);
        setErrorMessage(null);
        setStep('idle');
    };

    const handleClose = async () => {
        await cancelRecording();
        onClose();
    };

    const handleStartRecording = async () => {
        try {
            isStoppingRecordingRef.current = false;
            setErrorMessage(null);
            await startRecording(VOICE_RECORDING_MAX_SECONDS);
            setStep('recording');
        } catch (error) {
            setStep('error');
            setErrorMessage(error instanceof Error ? error.message : 'Microphone permission is needed to record a reminder.');
        }
    };

    const handleStopRecording = async () => {
        if (isStoppingRecordingRef.current) {
            return;
        }

        isStoppingRecordingRef.current = true;

        try {
            setErrorMessage(null);
            setStep('uploading');

            const audio = await stopRecording();
            const response = await reminderVoiceApi.analyzeVoiceReminder(audio, getTimezone());

            if (!response.transcript.trim()) {
                setStep('error');
                setErrorMessage(EMPTY_TRANSCRIPT_ERROR);
                return;
            }

            setAnalysis(response);
            setStep('success');
        } catch (error) {
            setStep('error');
            setErrorMessage(error instanceof Error && error.message ? error.message : GENERIC_UPLOAD_ERROR);
        }
    };

    useEffect(() => {
        if (step === 'recording' && elapsedSeconds >= VOICE_RECORDING_MAX_SECONDS) {
            void handleStopRecording();
        }
    }, [elapsedSeconds, step]);

    const renderContent = () => {
        if (step === 'requestingPermission') {
            return (
                <View className="items-center py-8">
                    <ActivityIndicator color={Theme.colors.accentPurple} />
                    <Text className="mt-4 text-sm font-sans-bold text-[#a1a1aa]">
                        Preparing microphone...
                    </Text>
                </View>
            );
        }

        if (step === 'recording') {
            return (
                <View className="items-center">
                    <View className="h-24 w-24 rounded-full bg-red-500/10 border border-red-500/20 items-center justify-center">
                        <View className="h-14 w-14 rounded-full bg-red-500 items-center justify-center">
                            <Mic size={26} color="#ffffff" />
                        </View>
                    </View>

                    <Text className="mt-6 text-4xl font-sans-extrabold text-white">
                        {formatElapsed(elapsedSeconds)}
                    </Text>
                    <Text className="mt-2 text-sm font-sans-bold text-[#a1a1aa]">
                        Recording reminder... {Math.max(VOICE_RECORDING_MAX_SECONDS - elapsedSeconds, 0)}s left
                    </Text>

                    <View className="mt-8 w-full flex-row gap-3">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleClose}
                            className="h-14 flex-1 rounded-2xl border border-white/10 bg-[#202022] items-center justify-center"
                        >
                            <Text className="text-white font-sans-extrabold text-sm">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleStopRecording}
                            className="h-14 flex-1 rounded-2xl bg-white items-center justify-center flex-row gap-2"
                        >
                            <Square size={15} color="#000000" fill="#000000" />
                            <Text className="text-black font-sans-extrabold text-sm">Stop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        if (step === 'uploading') {
            return (
                <View className="items-center py-8">
                    <ActivityIndicator color={Theme.colors.accentPurple} size="large" />
                    <Text className="mt-5 text-lg font-sans-extrabold text-white">
                        Analyzing voice...
                    </Text>
                    <Text className="mt-2 text-center text-sm font-sans-bold text-[#71717a]">
                        Turning your recording into reminder fields.
                    </Text>
                </View>
            );
        }

        if (step === 'success' && analysis) {
            return (
                <View>
                    <View className="items-center mb-6">
                        <View className="h-16 w-16 rounded-2xl bg-accent-purple items-center justify-center">
                            <Check size={28} color="#ffffff" strokeWidth={3} />
                        </View>
                        <Text className="mt-4 text-xl font-sans-extrabold text-white">
                            Voice analyzed
                        </Text>
                        <Text className="mt-1 text-sm font-sans-bold text-[#71717a]">
                            Confidence {formatConfidence(analysis.confidence)}
                        </Text>
                    </View>

                    <View className="rounded-3xl border border-white/10 bg-[#151518] p-4 mb-4">
                        <Text variant="micro" className="mb-2 text-[#71717a] tracking-[0.22em]">
                            TRANSCRIPT
                        </Text>
                        <Text className="text-sm font-sans-medium leading-6 text-[#a1a1aa]">
                            {analysis.transcript}
                        </Text>
                    </View>

                    <View className="rounded-3xl border border-accent-purple/30 bg-accent-purple/10 p-4 mb-5">
                        <Text variant="micro" className="mb-3 text-[#a78bfa] tracking-[0.22em]">
                            DETECTED FIELDS
                        </Text>
                        {detectedFields.length > 0 ? (
                            <View className="gap-3">
                                {detectedFields.map(([label, value]) => (
                                    <View key={label} className="flex-row justify-between gap-4">
                                        <Text className="text-xs font-sans-extrabold text-[#71717a] uppercase">
                                            {label}
                                        </Text>
                                        <Text className="flex-1 text-right text-sm font-sans-bold text-white">
                                            {value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-sm font-sans-bold text-[#a1a1aa]">
                                No reminder fields detected.
                            </Text>
                        )}
                    </View>

                    <View className="gap-3">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onApply(toVoiceReminderDraft(analysis))}
                            className="h-16"
                        >
                            <LinearGradient
                                colors={['#e12afb', '#9810fa']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 60,
                                    borderRadius: 22,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text className="text-white font-sans-extrabold text-base">
                                    Apply to form
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={resetForRetry}
                            className="h-12 rounded-2xl border border-white/10 bg-[#202022] items-center justify-center flex-row gap-2"
                        >
                            <RotateCcw size={15} color="#ffffff" />
                            <Text className="text-white font-sans-extrabold text-sm">Record again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        if (step === 'error') {
            return (
                <View>
                    <View className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 flex-row gap-3 mb-5">
                        <AlertCircle size={20} color="#f87171" />
                        <Text className="flex-1 text-sm font-sans-bold leading-6 text-red-100">
                            {errorMessage || recorderError || GENERIC_UPLOAD_ERROR}
                        </Text>
                    </View>

                    <View className="gap-3">
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={resetForRetry}
                            className="h-14 rounded-2xl bg-white items-center justify-center"
                        >
                            <Text className="text-black font-sans-extrabold text-sm">Try again</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleClose}
                            className="h-12 rounded-2xl border border-white/10 bg-[#202022] items-center justify-center"
                        >
                            <Text className="text-white font-sans-extrabold text-sm">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View className="items-center">
                <View className="h-24 w-24 rounded-[28px] bg-accent-purple/15 border border-accent-purple/25 items-center justify-center">
                    <Mic size={36} color={Theme.colors.accentPurple} />
                </View>

                <Text className="mt-6 text-xl font-sans-extrabold text-white">
                    Voice reminder
                </Text>
                <Text className="mt-2 text-center text-sm font-sans-bold leading-6 text-[#8b8b95]">
                    Record up to 30 seconds, then review the detected fields before filling the form.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleStartRecording}
                    className="mt-8 w-full h-16"
                >
                    <LinearGradient
                        colors={['#e12afb', '#9810fa']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flex: 1,
                            borderRadius: 24,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text className="text-white font-sans-extrabold text-base">
                            Start recording
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable className="flex-1 justify-end bg-black/70" onPress={handleClose}>
                <Pressable className="rounded-t-[34px] border border-white/10 bg-[#111114] px-6 pt-5 pb-8">
                    <View className="mb-6 flex-row items-center justify-end">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleClose}
                            className="h-12 w-12 rounded-full bg-white/5 items-center justify-center"
                        >
                            <X size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {renderContent()}
                </Pressable>
            </Pressable>
        </Modal>
    );
};
