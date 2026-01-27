import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronRight, Star } from 'lucide-react-native';
import { Text } from './ui/Text';


interface PlanCardProps {
    onPress?: () => void;
}

export const PlanCard = ({ onPress }: PlanCardProps) => {
    return (
        <TouchableOpacity activeOpacity={0.9} className="mb-8" onPress={onPress}>
            <View className="w-full rounded-[32px] border border-white/5 p-6 relative h-[120px] bg-[#171520] flex-row items-center justify-between">
                {/* Background Decorative Icon (Star) */}
                <View className="absolute right-[24px] top-[10px] opacity-20 transform rotate-[15deg] scale-150">
                    <Star size={48} color="#7c3aed" fill="#7c3aed" />
                </View>

                {/* Content */}
                <View className="relative z-10 flex-1">
                    <Text variant="micro" className="text-accent-fuchsia mb-2 tracking-[2px]">
                        CURRENT PLAN
                    </Text>

                    <View className="flex-row items-center gap-2 mb-2">
                        <Text variant="h3" weight="extrabold" className="text-white text-3xl">
                            Free
                        </Text>
                        <View className="bg-white/10 px-2 py-1 rounded-md">
                            <Text variant="micro" className="text-white/80 text-[8px] tracking-widest">
                                STARTER
                            </Text>
                        </View>
                    </View>

                    <Text variant="caption" weight="medium" className="text-text-muted text-[12px] opacity-60">
                        Upgrade to unlock AI scanning & protection
                    </Text>
                </View>

                {/* Action Button - Flexbox Centered */}
                <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center z-20">
                    <ChevronRight size={20} color="white" />
                </View>
            </View>
        </TouchableOpacity>
    );
};
