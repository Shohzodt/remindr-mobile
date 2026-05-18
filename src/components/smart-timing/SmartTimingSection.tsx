import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import { format } from 'date-fns';

interface SmartTimingSectionProps {
    time: string;
    date: string;
    isPast?: boolean;
    onTimeFixed: (newTime: string) => void;
}

export function SmartTimingSection({ time, date, isPast, onTimeFixed }: SmartTimingSectionProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'fixed'>('idle');

    const handleFixTiming = () => {
        setStatus('loading');
        
        // Simulate async delay
        setTimeout(() => {
            setStatus('fixed');
            onTimeFixed('tomorrow 09:30');
        }, 1500);
    };

    return (
        <View className="pt-1">
            <Text className="text-zinc-500 text-xs font-sans-bold uppercase tracking-[1px] mb-1.5">TIME & DATE</Text>
            
            {status === 'fixed' ? (
                <Animated.Text entering={FadeIn} className="text-white text-xl font-sans-bold">
                    Tomorrow, 09:30
                </Animated.Text>
            ) : (
                <Text className="text-white text-xl font-sans-bold">
                    {time} • {format(new Date(date), 'yyyy-MM-dd')}
                </Text>
            )}

            {/* Actions / States */}
            {isPast && status === 'idle' && (
                <TouchableOpacity onPress={handleFixTiming} className="mt-2 flex-row items-center active:opacity-70">
                    <Text className="text-green-400 font-sans-bold">✨ Fix timing</Text>
                </TouchableOpacity>
            )}

            {status === 'loading' && (
                <View className="mt-2 flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#4ade80" />
                    <Text className="text-green-400/80 font-sans-medium">Analyzing...</Text>
                </View>
            )}

            {status === 'fixed' && (
                <Animated.View entering={FadeInUp.delay(200)} className="mt-3 gap-3">
                    {/* Confidence */}
                    <View className="flex-row items-center gap-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <Text className="text-zinc-400 text-sm font-sans-medium">Medium confidence</Text>
                    </View>
                    
                    {/* Risk Signal */}
                    <View className="bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 rounded-xl flex-row items-center gap-2.5 self-start">
                        <AlertTriangle size={14} color="#f59e0b" />
                        <Text className="text-amber-500/90 text-xs font-sans-medium">Delayed several times</Text>
                    </View>
                </Animated.View>
            )}
        </View>
    );
}
