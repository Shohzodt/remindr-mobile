import React from 'react';
import { View, Pressable } from 'react-native';
import { Reminder, ReminderCategory, Plan } from '@/types';
import { Text } from '@/components/ui/Text';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  Briefcase,
  User,
  Users,
  Calendar,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react-native';

interface EventCardProps {
  item: Reminder | any; // 'any' allows for the mock data fields like 'risk' or 'color' which might be loosely typed
  userPlan?: Plan;
  isLocked?: boolean;
  type?: 'protected' | 'risk' | 'normal';
  dimmed?: boolean;
  onClick: () => void;
}

export const EventCard = ({
  item,
  userPlan = 'Free',
  isLocked = false,
  type = 'normal',
  dimmed = false,
  onClick
}: EventCardProps) => {
  const isPremium = userPlan === 'Premium';

  // For mobile, we might want to simplify logic or keep it 1:1. Keeping 1:1 for fidelity.
  const isFree = userPlan === 'Free';

  const isProtected = type === 'protected' || item.isGuardian;
  const isRisk = type === 'risk';

  const isHardDeadline = item.decisionControl?.hardDeadline?.enabled ?? false;

  const isHardDeadlineMissed = (() => {
    if (!isHardDeadline || item.status === 'completed') return false;
    const reminderDate = new Date(item.date);
    reminderDate.setHours(23, 59, 59, 999);
    return new Date() > reminderDate;
  })();

  const hasFutureImpact = item.decisionControl?.futureImpact?.enabled ?? false;

  const showUrgency = !isFree;
  const showAI = isPremium;

  const isCompleted = item.status === 'completed';

  const getIconConfig = () => {
    if (isCompleted) {
      return {
        icon: <CheckCircle2 size={24} color="#10b981" />, // emerald-500
        classes: 'bg-emerald-500/10'
      };
    }
    if (isLocked) {
      return {
        icon: <Lock size={20} color="#71717a" />, // zinc-500
        classes: 'bg-zinc-800'
      };
    }
    if (isProtected) {
      return {
        icon: <ShieldCheck size={24} color="#000000" />,
        classes: 'bg-white'
      };
    }
    if (isRisk) {
      // item.color usually has "text-amber-500", need to map to hex for Lucide color
      // Simplified mapping for now
      let iconColor = '#F59E0B'; // amber-500 default
      if (item.color?.includes('red')) iconColor = '#EF4444';

      return {
        icon: <AlertTriangle size={24} color={iconColor} />,
        classes: 'bg-white/5'
      };
    }

    switch (item.category) {
      case ReminderCategory.WORK:
      case 'work':
      case 'Work':
        return {
          icon: <Briefcase size={24} color="#C084FC" />, // purple-400
          classes: 'bg-purple-600/10'
        };
      case ReminderCategory.PERSONAL:
      case 'personal':
      case 'Personal':
        return {
          icon: <User size={24} color="#F472B6" />, // pink-400
          classes: 'bg-pink-600/10'
        };
      case ReminderCategory.SOCIAL:
      case 'social':
      case 'Social':
        return {
          icon: <Users size={24} color="#FBBF24" />, // amber-400
          classes: 'bg-amber-600/10'
        };
      default:
        return {
          icon: <Calendar size={24} color="#71717a" />,
          classes: 'bg-zinc-800/20'
        };
    }
  };

  const config = getIconConfig();

  // Helper for text colors
  const getStatusColorClass = () => {
    if (isCompleted) return 'text-zinc-500 line-through';
    if (item.status === 'missed_protected') return 'text-destructive';
    if (isHardDeadline) return 'text-amber-400';
    if (isRisk) return item.color || 'text-amber-500'; // Fallback needs to be class
    if (isProtected) return 'text-white';
    return 'text-text-secondary';
  };

  return (
    <Pressable
      onPress={!isLocked ? onClick : undefined}
      className={`
        bg-card p-5 rounded-[30px] flex-row items-center gap-5 border
        ${isProtected ? 'border-white/20' : 'border-white/5'}
        ${isLocked ? 'opacity-30' : 'active:opacity-90'}
        ${dimmed ? 'opacity-50' : ''}
      `}
    >
      {/* Icon */}
      <View
        className={`w-[52px] h-[52px] rounded-2xl items-center justify-center shrink-0 ${config.classes}`}
      >
        {config.icon}
      </View>

      <View className="flex-1 min-w-0">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            variant="body"
            weight="bold"
            className={`text-white flex-1 mr-2 ${isCompleted ? 'text-zinc-500 line-through' : ''}`}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          {/* Badges */}
          <View className="shrink-0">
            {isHardDeadlineMissed ? (
              <View className="w-6 h-6 rounded-lg bg-red-500/15 items-center justify-center">
                <AlertOctagon size={12} color="#F87171" />
              </View>
            ) : isHardDeadline && !isCompleted ? (
              <View className="w-6 h-6 rounded-lg bg-amber-500/15 items-center justify-center">
                <AlertTriangle size={12} color="#FBBF24" />
              </View>
            ) : ((showUrgency && isProtected && item.priority === 'must') || isProtected) && !isCompleted ? (
              <View className="bg-white px-2 py-0.5 rounded-full">
                <Text variant="micro" className="text-black text-[9px]">
                  {item.status === 'missed_protected' ? 'MISSED' : 'PROTECTED'}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center flex-wrap gap-x-3 gap-y-1">
          {isLocked ? (
            <Text variant="caption" className="text-text-dim">Protected Mode Required</Text>
          ) : (
            <View className="flex-row items-center gap-3">
              <Text variant="caption" weight="semibold" className={getStatusColorClass()}>
                {item.status === 'missed_protected' ? `Escalated to ${item.guardianSettings?.contact || 'Guardian'}` :
                  isCompleted ? 'Completed' :
                    dimmed ? 'Passed' :
                      isHardDeadline ? 'Commitment' :
                        showUrgency && isRisk && item.risk ? `${item.risk} Risk` :
                          (item.time || 'Today')}
              </Text>

              {/* Days Left Logic */}
              {isHardDeadline && !isHardDeadlineMissed && !isCompleted && !dimmed && (() => {
                const daysLeft = Math.ceil((new Date(item.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1 h-1 rounded-full bg-zinc-700" />
                    <Text variant="caption" className="text-text-muted">
                      {daysLeft <= 0 ? 'Due today' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
                    </Text>
                  </View>
                );
              })()}

              {!isCompleted && item.location && (
                <View className="flex-row items-center gap-1.5">
                  <View className="w-1 h-1 rounded-full bg-zinc-800" />
                  <MapPin size={12} color="#52525b" />
                  <Text variant="caption" className="text-text-dim max-w-[100px]" numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* AI Insight */}
        {showAI && (isProtected || isRisk) && !isHardDeadline && !isCompleted && (
          <Text
            variant="caption"
            weight="medium"
            className="text-text-secondary italic mt-2 opacity-80"
            style={{ fontFamily: 'PlusJakartaSans_500Medium_Italic' }}
          >
            AI: {item.insight || 'Context verified. No action required today.'}
          </Text>
        )}
      </View>

      {!isLocked && (
        <ChevronRight size={20} color="#27272a" /> // zinc-800
      )}
    </Pressable>
  );
};
