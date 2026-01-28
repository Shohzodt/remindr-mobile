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
      className="opacity-[0.6] bg-[#050505] border border-white/10 rounded-[32px] p-5 flex-row items-center gap-6 active:opacity-90"
    >
      <View className="w-12 h-12 rounded-2xl bg-zinc-900/50 items-center justify-center shrink-0 border border-white/5">
        <Lock size={20} color="#52525b" />
      </View>

      <View className="flex-1">
        <Text
          weight="extrabold"
          className="text-xs text-zinc-500 mb-1 uppercase tracking-[1px]"
        >
          {title}
        </Text>
        <Text
          weight="bold"
          className="text-xxs text-zinc-600 leading-5"
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
};
