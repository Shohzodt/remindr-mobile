import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle } from 'lucide-react-native';

interface EmptyStateProps {
  message: string;
  subtext: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  message, 
  subtext, 
  icon, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <View className="relative overflow-hidden rounded-[45px]">
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.05)', 'transparent']}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      
      <View className="py-14 items-center justify-center bg-[#0B0B0F]/40 border border-white/5 px-8 rounded-[45px]">
        <View className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 items-center justify-center mb-6 shadow-xl">
          {icon || <AlertCircle size={32} color="#52525b" />}
        </View>
        
        <Text variant="micro" className="text-white tracking-[0.3em] mb-2">{message}</Text>
        
        <Text variant="caption" className="text-text-muted text-center leading-5 max-w-[220px] mb-8">
          {subtext}
        </Text>
        
        {actionLabel && onAction && (
          <Button 
            variant="secondary" 
            size="sm" 
            label={actionLabel} 
            onPress={onAction}
            className="px-6 h-12 rounded-2xl bg-white/5 border border-white/10"
          />
        )}
      </View>
    </View>
  );
};
