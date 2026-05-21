import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Plus, Sparkles, UploadCloud, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';

type DocAiStep = 'empty' | 'selected' | 'scanning' | 'complete';

export interface DocAiDetectedDeadline {
    date: string;
    title: string;
    quote: string;
}

const MOCK_DOC_AI_FILE_NAME = 'PROFILE (1).PDF';
const MOCK_DOC_AI_DEADLINES: DocAiDetectedDeadline[] = [
    {
        date: '2024-11-15',
        title: 'Service Renewal Deadline',
        quote: 'Renewal notice must be submitted to prevent automatic 15% rate hike.',
    },
    {
        date: '2024-12-01',
        title: 'Annual Compliance Audit',
        quote: 'Submission of security logs required for Q4 compliance review.',
    },
];

interface DocumentAiSheetProps {
    visible: boolean;
    onClose: () => void;
    onCreateReminder: (deadline: DocAiDetectedDeadline, sourceFileName: string) => void;
}

export const DocumentAiSheet = ({ visible, onClose, onCreateReminder }: DocumentAiSheetProps) => {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const [step, setStep] = useState<DocAiStep>('empty');
    const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sheetMaxHeight = height * 0.88;
    const reportScrollMaxHeight = sheetMaxHeight - Math.max(insets.bottom, 28) - 96;

    const clearScanTimer = () => {
        if (scanTimerRef.current) {
            clearTimeout(scanTimerRef.current);
            scanTimerRef.current = null;
        }
    };

    const reset = () => {
        clearScanTimer();
        setStep('empty');
    };

    const close = () => {
        onClose();
        reset();
    };

    const analyzeDocument = () => {
        if (step !== 'selected') return;

        setStep('scanning');
        scanTimerRef.current = setTimeout(() => {
            setStep('complete');
            scanTimerRef.current = null;
        }, 1200);
    };

    useEffect(() => {
        if (!visible) {
            reset();
        }

        return clearScanTimer;
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
                    {step === 'scanning' ? (
                        <>
                            <View className="mb-6 h-10 items-end">
                                <TouchableOpacity
                                    onPress={close}
                                    activeOpacity={0.8}
                                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                                >
                                    <X size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </View>

                        <View className="min-h-[420px] items-center justify-center">
                            <View className="mb-8 h-28 w-28 items-center justify-center rounded-full border-4 border-white">
                                <View className="absolute bottom-0 right-1 h-9 w-9 rounded-full bg-accent-purple" />
                                <View className="h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
                                    <Sparkles size={28} color={Theme.colors.accentPurple} />
                                </View>
                            </View>

                            <Text className="text-[28px] font-sans-extrabold text-white">
                                Scanning Document
                            </Text>
                            <Text className="mt-3 text-sm font-sans-bold text-[#71717a]">
                                Extracting deadlines and key terms...
                            </Text>
                        </View>
                        </>
                    ) : step === 'complete' ? (
                        <>
                            <View className="mb-7 flex-row items-center justify-between">
                                <View className="rounded-xl bg-accent-purple/15 px-3 py-1.5">
                                    <Text variant="micro" className="text-accent-purple text-[9px] tracking-[0.25em]">
                                        AI REPORT
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={close}
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
                                    Cloud infrastructure services renewal for the 2024 fiscal year. Document outlines a 12-month commitment with scheduled maintenance and rate adjustments.
                                </Text>
                            </View>

                            <Text variant="micro" className="mb-4 pl-1 text-[#71717a] tracking-[0.25em]">
                                DETECTED DATES
                            </Text>

                            <View className="gap-5">
                                {MOCK_DOC_AI_DEADLINES.map((deadline) => (
                                    <View
                                        key={`${deadline.date}-${deadline.title}`}
                                        className="rounded-[28px] border border-white/10 bg-card p-5"
                                    >
                                        <Text className="mb-2 text-base font-sans-extrabold text-accent-purple">
                                            {deadline.date}
                                        </Text>
                                        <Text className="mb-5 text-xl font-sans-extrabold text-white">
                                            {deadline.title}
                                        </Text>
                                        <Text
                                            className="mb-7 text-sm font-sans-medium italic leading-6 text-[#8b8b95]"
                                            style={{ fontFamily: 'PlusJakartaSans_500Medium_Italic' }}
                                        >
                                            "{deadline.quote}"
                                        </Text>

                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() => onCreateReminder(deadline, MOCK_DOC_AI_FILE_NAME)}
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

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => setStep('empty')}
                                className="mt-6 h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                            >
                                <Text className="text-sm font-sans-extrabold text-white">
                                    Rescan
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                        </>
                    ) : (
                        <>
                            <View className="mb-6 h-10 items-end">
                                <TouchableOpacity
                                    onPress={close}
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
                                    Upload a PDF or DOCX to detect deadlines
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => setStep('selected')}
                                className={`mb-7 min-h-[190px] items-center justify-center rounded-[28px] border-2 px-6 ${step === 'selected'
                                    ? 'border-accent-purple bg-accent-purple/5'
                                    : 'border-[#3a3a42] bg-white/[0.03]'
                                    }`}
                                style={{ borderStyle: 'dashed' }}
                            >
                                <View className={`mb-5 h-20 w-20 items-center justify-center rounded-[24px] ${step === 'selected' ? 'bg-accent-purple' : 'bg-white/[0.04]'}`}>
                                    {step === 'selected' ? (
                                        <Check size={34} color="#ffffff" strokeWidth={3} />
                                    ) : (
                                        <UploadCloud size={32} color="#71717a" />
                                    )}
                                </View>

                                <Text variant="micro" className="mb-2 text-white/80 text-[11px] tracking-[0.2em]">
                                    {step === 'selected' ? MOCK_DOC_AI_FILE_NAME : 'TAP TO SELECT FILE'}
                                </Text>
                                <Text variant="micro" className="text-[#52525b] text-[9px] tracking-[0.08em]">
                                    MAX 10MB - PDF, DOCX
                                </Text>
                            </Pressable>

                            {step === 'selected' ? (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={analyzeDocument}
                                    className="mb-6 h-16 overflow-hidden rounded-[24px]"
                                >
                                    <LinearGradient
                                        colors={['#e12afb', '#9810fa']}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text className="text-base font-sans-extrabold text-white">
                                            Analyze Document
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <View className="mb-6 h-16 items-center justify-center rounded-[24px] border border-white/5 bg-white/[0.04]">
                                    <Text className="text-base font-sans-extrabold text-[#3f3f46]">
                                        Analyze Document
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};
