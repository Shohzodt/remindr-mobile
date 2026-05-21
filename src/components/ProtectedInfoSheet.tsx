import React from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, ShieldCheck, X, Zap } from 'lucide-react-native';
import { Reminder } from '@/types';
import { Text } from '@/components/ui/Text';
import { useReminderGuardian } from '@/hooks/useReminders';
import { GuardianStatusTone } from '@/services/reminders.service';
import { formatGuardianDueLabel } from '@/utils/reminderTime';

interface ProtectedInfoSheetProps {
    visible: boolean;
    reminder: Reminder | null;
    onClose: () => void;
}

const DEFAULT_CONSEQUENCES = [
    {
        title: 'Deadline consequence tracking',
        desc: 'Remindr keeps this item in a protected queue because missing it may create follow-up risk.',
    },
    {
        title: 'Context stays visible',
        desc: 'Important notes, location, and AI context stay attached so the reminder is not treated like a casual task.',
    },
    {
        title: 'Escalation awareness',
        desc: 'Protected reminders are highlighted separately before they become expensive or difficult to recover.',
    },
];

const getStatusConfig = (status?: GuardianStatusTone) => {
    switch (status) {
        case 'warning':
            return {
                icon: <AlertTriangle size={16} color="#FBBF24" />,
                iconColor: '#FBBF24',
                borderClass: 'border-amber-500/10',
                bgClass: 'bg-amber-500/5',
                textClass: 'text-amber-400',
            };
        case 'danger':
            return {
                icon: <AlertOctagon size={16} color="#F87171" />,
                iconColor: '#F87171',
                borderClass: 'border-red-500/10',
                bgClass: 'bg-red-500/5',
                textClass: 'text-red-400',
            };
        case 'info':
            return {
                icon: <Info size={16} color="#A1A1AA" />,
                iconColor: '#A1A1AA',
                borderClass: 'border-white/10',
                bgClass: 'bg-white/[0.03]',
                textClass: 'text-zinc-300',
            };
        case 'success':
        default:
            return {
                icon: <CheckCircle2 size={16} color="#10B981" />,
                iconColor: '#10B981',
                borderClass: 'border-emerald-500/10',
                bgClass: 'bg-emerald-500/5',
                textClass: 'text-emerald-400',
            };
    }
};

const getGuardianErrorMessage = (error: any) => {
    if (error?.response?.status === 403) {
        return 'Reminder Guardian is a Pro feature.';
    }

    const message = error?.response?.data?.message;
    const text = Array.isArray(message) ? message.join(' ') : message;

    if (typeof text === 'string' && text.toLowerCase().includes('deadlineat')) {
        return 'Set a deadline first to use Reminder Guardian.';
    }

    return 'We could not load Guardian details right now.';
};

export const ProtectedInfoSheet = ({ visible, reminder, onClose }: ProtectedInfoSheetProps) => {
    const insets = useSafeAreaInsets();
    const {
        data: guardianDetail,
        isLoading,
        error,
    } = useReminderGuardian(reminder?.id, visible);
    const localDeadlineAt = reminder?.date && reminder?.time ? `${reminder.date}T${reminder.time}:00` : null;
    const guardianDueDisplay = formatGuardianDueLabel(
        guardianDetail?.deadlineAt ?? reminder?.deadlineAt ?? localDeadlineAt
    );
    const title = guardianDetail?.title || reminder?.title || 'Protected reminder';
    const isProtected = guardianDetail?.isProtected ?? (reminder as any)?.isProtected ?? reminder?.isGuardian;
    const isActiveProtected = Boolean(isProtected) && (guardianDetail?.status || reminder?.status || 'active') === 'active';
    const statusBadgeLabel = isActiveProtected ? 'Active' : 'Inactive';
    const summaryTitle = guardianDetail?.summary?.title;
    const summaryDescription = guardianDetail?.summary?.description;
    const summaryItems = guardianDetail?.summary?.items || [];
    const contextConfig = getStatusConfig(guardianDetail?.context?.status || 'warning');
    const contextTitle = guardianDetail?.context?.title;
    const contextDescription = guardianDetail?.context?.description;
    const errorMessage = getGuardianErrorMessage(error);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0 bg-black/80" onPress={onClose} />

                <View
                    className="relative rounded-t-[34px] border border-white/10 bg-[#111114] px-6 pt-6"
                    style={{ height: '88%', paddingBottom: Math.max(insets.bottom, 20) }}
                >
                    <View className="mb-6 flex-row items-start justify-between gap-4">
                        <View className="flex-1">
                            <View className="mb-3 flex-row items-center gap-2">
                                <View className="flex-row items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1">
                                    <ShieldCheck size={12} color="#A855F7" />
                                    <Text variant="micro" className="text-purple-400 text-[9px]">
                                        {statusBadgeLabel}
                                    </Text>
                                </View>
                                <Text variant="micro" className="text-text-dim text-[9px]">
                                    {guardianDueDisplay}
                                </Text>
                            </View>

                            <Text className="text-two-xl font-sans-extrabold text-white" numberOfLines={2}>
                                {title}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                            activeOpacity={0.8}
                        >
                            <X size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <View className="items-center justify-center rounded-[28px] p-5">
                                <ActivityIndicator color="#A855F7" size="large" />
                            </View>
                        </View>
                    ) : (
                        <ScrollView
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 8 }}
                        >
                            {error ? (
                            <View className="mb-8 rounded-[28px] border border-red-500/10 bg-red-500/5 p-5">
                                <View className="flex-row items-center gap-3">
                                    <AlertOctagon size={16} color="#F87171" />
                                    <Text variant="caption" className="flex-1 text-red-300">
                                        {errorMessage}
                                    </Text>
                                </View>
                            </View>
                        ) : summaryTitle || summaryDescription || summaryItems.length > 0 ? (
                            <View className="mb-8 rounded-[28px] border border-white/5 bg-white/[0.03] p-5">
                                <View className="mb-4 flex-row items-center gap-4">
                                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10">
                                        <Zap size={22} color="#A855F7" />
                                    </View>
                                    <View className="flex-1">
                                        {!!summaryTitle && (
                                            <Text className="text-[15px] font-sans-bold text-white">
                                                {summaryTitle}
                                            </Text>
                                        )}
                                        {!!summaryDescription && (
                                            <Text variant="caption" className="text-text-muted">
                                                {summaryDescription}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {summaryItems.length > 0 && (
                                    <View className="gap-3 border-t border-white/5 pt-4">
                                        {summaryItems.map((item, index) => {
                                            const itemConfig = getStatusConfig(item.status);
                                            return (
                                                <View key={`${item.title}-${index}`} className="flex-row items-center gap-3">
                                                    {itemConfig.icon}
                                                    <Text variant="caption" className="text-text-secondary">
                                                        {item.title}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        ) : null}

                        <View className="mb-8">
                            <Text variant="micro" className="mb-4 pl-1 text-text-dim">
                                What protection means
                            </Text>
                            <View className="gap-3">
                                {DEFAULT_CONSEQUENCES.map((item) => (
                                    <View
                                        key={item.title}
                                        className="flex-row gap-4 rounded-[24px] border border-white/5 bg-card p-5"
                                    >
                                        <View className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-700" />
                                        <View className="flex-1">
                                            <Text className="text-[14px] font-sans-bold text-white">
                                                {item.title}
                                            </Text>
                                            <Text variant="caption" className="mt-1 leading-5 text-text-muted">
                                                {item.desc}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {(contextTitle || contextDescription) && (
                            <View className={`rounded-[24px] border p-5 ${contextConfig.borderClass} ${contextConfig.bgClass}`}>
                                <View className="mb-2 flex-row items-center gap-2">
                                    {contextConfig.icon}
                                    <Text className={`text-[13px] font-sans-bold ${contextConfig.textClass}`}>
                                        {contextTitle}
                                    </Text>
                                </View>
                                {!!contextDescription && (
                                    <Text variant="caption" className="leading-5 text-text-secondary">
                                        {contextDescription}
                                    </Text>
                                )}
                            </View>
                        )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};
