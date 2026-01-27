import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count?: number;
}

export const FilterChip = ({ label, isActive, onPress, count }: FilterChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`
        px-5 py-2.5 rounded-full border mr-3
        ${isActive 
          ? 'bg-accent-purple border-accent-purple' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'}
      `}
    >
      <View className="flex-row items-center gap-2">
        <Text 
          variant="caption" 
          weight={isActive ? 'bold' : 'medium'}
          className={isActive ? 'text-white' : 'text-text-secondary'}
        >
          {label}
        </Text>
        {count !== undefined && (
          <View className={`px-1.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
            <Text 
              variant="caption" 
              className={isActive ? 'text-white' : 'text-text-dim'}
              style={{ fontSize: 10 }}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};
