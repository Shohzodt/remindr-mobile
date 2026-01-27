import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Lock } from 'lucide-react-native';

interface SoftLockPlaceholderProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export const SoftLockPlaceholder = ({ title, description, onPress }: SoftLockPlaceholderProps) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-[#0B0B0F]/60 border border-white/5 rounded-[32px] p-6 flex-row items-center gap-5 active:opacity-80"
      style={{ opacity: 0.6 }} // grayscale effect simulated with opacity
    >
      <View className="w-12 h-12 rounded-2xl bg-white/[0.03] items-center justify-center shrink-0">
        <Lock size={20} color="#52525b" />
      </View>
      
      <View className="flex-1">
        <Text variant="micro" className="text-text-muted mb-1">{title}</Text>
        <Text variant="micro" className="text-text-dim normal-case leading-tight font-medium" style={{ fontSize: 10 }}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
};
