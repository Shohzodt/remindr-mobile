import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Reminder } from '@/types';
import { Trash2, Check } from 'lucide-react-native';

interface ReminderRowProps {
  item: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderRow = ({ item, onToggle, onDelete }: ReminderRowProps) => {
  const isOverdue = item.time?.includes('Overdue') || (new Date(item.date) < new Date() && item.status !== 'completed');
  
  // Format date for display (mocking "Jan 25 at 20:11" format)
  const displayDate = item.time || `${item.date} at 09:00`; 

  return (
    <View className="flex-row items-center bg-logo-container border border-white/5 p-4 rounded-2xl mb-3">
      {/* Checkbox */}
      <TouchableOpacity 
        onPress={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-md border-2 mr-4 items-center justify-center ${
          item.status === 'completed' 
            ? 'bg-accent-purple border-accent-purple' 
            : 'border-white/20'
        }`}
      >
        {item.status === 'completed' && <Check size={12} color="white" />}
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 
          <Text variant="body" weight="bold" className="text-white">
            {item.title}
          </Text>
        </View>
        
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1.5">
             <Text 
               variant="caption" 
               className={isOverdue ? "text-destructive" : "text-text-secondary"}
             >
               {displayDate} {isOverdue && '(Overdue)'}
             </Text>
          </View>
          
          <Text variant="caption" className="text-text-dim">•</Text>
          
          <Text variant="caption" className="text-accent-fuchsia font-medium">
            {item.category}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity 
        onPress={() => onDelete(item.id)}
        className="w-8 h-8 items-center justify-center rounded-lg bg-white/5 active:bg-white/10"
      >
        <Trash2 size={16} color="#71717a" />
      </TouchableOpacity>
    </View>
  );
};
