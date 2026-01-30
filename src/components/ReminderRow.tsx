import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Reminder } from '@/types';
import { Trash2, Check } from 'lucide-react-native';

interface ReminderRowProps {
  item: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  onPress?: () => void;
}

export const ReminderRow = ({ item, onToggle, onDelete, isLoading = false, onPress }: ReminderRowProps) => {
  // Better Overdue Logic
  const isOverdue = React.useMemo(() => {
    if (item.status === 'completed') return false;

    // If we have a specific time, combine it
    if (item.date && item.time && item.time.includes(':')) {
      const [hours, minutes] = item.time.split(':').map(Number);
      const reminderDate = new Date(item.date);
      reminderDate.setHours(hours, minutes, 0, 0);
      return reminderDate < new Date();
    }

    // Fallback: If date matches today, it's not overdue (unless time passed, handled above).
    // If date is strictly before today, it is overdue.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0); // Normalize to midnight for strict date comparison

    return itemDate < today;
  }, [item.date, item.time, item.status]);

  // Format date for display
  const displayDate = item.time || item.date;

  return (
    <View className="flex-row items-center bg-logo-container border border-white/5 p-4 rounded-2xl mb-3">
      {/* Checkbox */}
      <Pressable
        onPress={() => onToggle(item.id)}
        disabled={isLoading}
        className={`w-5 h-5 rounded-md border-2 mr-4 items-center justify-center ${item.status === 'completed'
          ? 'bg-accent-purple border-accent-purple'
          : 'border-white/20'
          } ${isLoading ? 'opacity-50' : ''}`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#d946ef" />
        ) : (
          item.status === 'completed' && <Check size={12} color="white" />
        )}
      </Pressable>

      {/* Content - Clickable Area */}
      <Pressable
        className="flex-1"
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <Text
            variant="body"
            weight="bold"
            className="text-white flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
      </Pressable>

      {/* Actions */}
      <Pressable
        onPress={() => onDelete(item.id)}
        className="w-8 h-8 items-center justify-center rounded-lg bg-white/5 active:bg-white/10 ml-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Trash2 size={16} color="#71717a" />
      </Pressable>
    </View>
  );
};
