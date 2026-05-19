import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { format } from 'date-fns';
import { FixTimingResponse } from '@/services/reminders.service';

interface SmartTimingSectionProps {
    time: string;
    date: string;
    canFixTiming?: boolean;
    decision?: FixTimingResponse;
    errorMessage?: string | null;
    fixCount?: number;
    isFixing?: boolean;
    onFixTiming: () => void;
}

const REASON_LABELS: Record<FixTimingResponse['reasonCode'], string> = {
    NEXT_WINDOW: 'Next available window',
    DEADLINE_CONSTRAINED: 'Deadline protected',
    WEEKEND_SHIFT: 'Moved away from weekend',
    INTERRUPTION_AVOIDED: 'Interruption avoided',
    ESCALATED: 'Needs attention',
};

const formatConfidence = (confidence: FixTimingResponse['confidence']) =>
    `${confidence.charAt(0).toUpperCase()}${confidence.slice(1)} confidence`;

export function SmartTimingSection({
    time,
    date,
    canFixTiming,
    decision,
    errorMessage,
    fixCount,
    isFixing,
    onFixTiming
}: SmartTimingSectionProps) {
    const scheduledAt = decision ? new Date(decision.scheduledAt) : null;
    const hasSeveralFixes = (fixCount ?? 0) >= 3 || decision?.risk === true;

    return (
        <View className="pt-1">
            <Text className="text-zinc-500 text-xs font-sans-bold uppercase tracking-[1px] mb-1.5">TIME & DATE</Text>

            {scheduledAt ? (
                <Animated.Text entering={FadeIn} className="text-white text-xl font-sans-bold">
                    {format(scheduledAt, 'MMM d, HH:mm')}
                </Animated.Text>
            ) : (
                <Text className="text-white text-xl font-sans-bold">
                    {time} • {format(new Date(`${date}T00:00:00`), 'yyyy-MM-dd')}
                </Text>
            )}

            {/* Actions / States */}
            {canFixTiming && !decision && !isFixing && (
                <TouchableOpacity onPress={onFixTiming} className="mt-2 flex-row items-center active:opacity-70">
                    <Text className="text-green-400 font-sans-bold">Fix timing</Text>
                </TouchableOpacity>
            )}

            {isFixing && (
                <View className="mt-2 flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#4ade80" />
                    <Text className="text-green-400/80 font-sans-medium">Analyzing...</Text>
                </View>
            )}

            {errorMessage && !isFixing && (
                <Text className="text-red-400 text-sm font-sans-medium mt-2">
                    {errorMessage}
                </Text>
            )}

            {decision && (
                <Animated.View entering={FadeInUp.delay(200)} className="mt-3 gap-3">
                    {/* Confidence */}
                    <View className="flex-row items-center gap-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <Text className="text-zinc-400 text-sm font-sans-medium">
                            {formatConfidence(decision.confidence)}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <Text className="text-zinc-400 text-sm font-sans-medium">
                            {REASON_LABELS[decision.reasonCode]}
                        </Text>
                    </View>

                </Animated.View>
            )}

            {hasSeveralFixes && (
                <View className="mt-3 bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 rounded-xl flex-row items-center gap-2.5 self-start">
                    <AlertTriangle size={14} color="#f59e0b" />
                    <Text className="text-amber-500/90 text-xs font-sans-medium">Delayed several times</Text>
                </View>
            )}
        </View>
    );
}
