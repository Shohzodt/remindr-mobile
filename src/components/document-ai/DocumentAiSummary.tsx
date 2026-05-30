import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { FileText, Plus, X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { AnalyzeDocumentResponse } from '@/services/documents.service';
import type { DocAiDetectedDeadline } from './types';

interface DocumentAiSummaryProps {
    analysis: AnalyzeDocumentResponse | null;
    reportScrollMaxHeight: number;
    onClose: () => void;
    onRescan: () => void;
    onCreateReminder: (deadline: DocAiDetectedDeadline) => void;
}

export function DocumentAiSummary({
    analysis,
    reportScrollMaxHeight,
    onClose,
    onRescan,
    onCreateReminder,
}: DocumentAiSummaryProps) {
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
