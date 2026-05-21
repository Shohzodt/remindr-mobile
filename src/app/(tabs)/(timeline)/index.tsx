import React from 'react';
import { ActivityIndicator, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { ProtectedInfoSheet } from '@/components/ProtectedInfoSheet';
import { useAuth } from '@/context/AuthContext';
import { useGuardianReminders, useReminders } from '@/hooks/useReminders';
import { Bell, CheckCircle, Shield } from 'lucide-react-native';
import { Layout } from "@/constants/layout";
import { RefreshControl } from 'react-native';
import { formatGuardianDueLabel, isPastReminder } from '@/utils/reminderTime';
import { getDisplayText } from '@/utils/displayText';
import { Reminder } from '@/types';

export default function TimelineScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Assuming useAuth provides user object
  // Use Real Hook
  const { reminders: apiReminders, isLoading, refetch } = useReminders();
  const {
    data: guardianTimeline,
    isLoading: isGuardianLoading,
    error: guardianError,
    refetch: refetchGuardian,
  } = useGuardianReminders();
  const reminders = apiReminders;
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedProtectedReminder, setSelectedProtectedReminder] = React.useState<Reminder | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchGuardian()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Logic from Web
  const userPlan = user?.plan || 'Free';
  const guardianItems = guardianTimeline?.items || [];
  const isGuardianLocked = Boolean(guardianTimeline?.locked);
  const guardianUpsellTitle = getDisplayText(guardianTimeline?.upsellTitle, 'Reminder Guardian');
  const guardianUpsellSummary = getDisplayText(guardianTimeline?.upsellSummary || guardianTimeline?.summary, 'Upgrade to Pro to unlock Reminder Guardian.');
  const guardianCtaLabel = getDisplayText(guardianTimeline?.ctaLabel, 'Upgrade to Pro');

  // Time-based filtering for general reminders
  const generalReminders = reminders.filter(r =>
    !r.isGuardian && !r.isProtected
  );

  const upcomingReminders = generalReminders.filter(r => !isPastReminder(r.date, r.time));
  const upNextReminders = upcomingReminders.slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-1 bg-bg-primary">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <RefreshControl refreshing={true} tintColor="white" />
        </View>
      ) : (
        <SafeAreaView edges={['top']} className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              ...Layout.tabBarAwareContent,
              paddingTop: 20,
              paddingHorizontal: 24,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="white"
              />
            }
          >
            {/* HEADER */}
            <View className="flex-row justify-between items-start mb-8">
              <View>
                <Text className="text-large font-sans-extrabold text-white">Timeline</Text>
                <Text className="text-md font-sans-medium text-text-muted">
                  {getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => router.push('/notifications')}
                  className="w-10 h-10 rounded-full border border-white/20 bg-zinc-900 items-center justify-center border border-white/5 active:bg-zinc-800 relative"
                >
                  <View className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-accent-purple border border-[#151518] z-10" />
                  <Bell size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/settings')}
                  className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-zinc-800 active:scale-95"
                >
                  {user?.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} className="w-full h-full" />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-accent-purple">
                      <Text variant="body" weight="bold" className="text-white">
                        {user?.displayName?.[0] || 'U'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* 1) REMINDER GUARDIAN */}
            <View className="mb-10">
              <Text variant="micro" className="text-text-dim mb-5 pl-1">Reminder Guardian</Text>
              <View className="gap-3">
                {isGuardianLoading ? (
                  <View className="rounded-[32px] border border-white/5 bg-card p-8 items-center justify-center">
                    <ActivityIndicator color="#A855F7" />
                  </View>
                ) : guardianError ? (
                  <EmptyState
                    message="Guardian unavailable"
                    subtext="Reminder Guardian could not be loaded right now."
                    icon={<Shield size={32} color="#52525b" />}
                  />
                ) : isGuardianLocked ? (
                  <EmptyState
                    message={guardianUpsellTitle}
                    subtext={guardianUpsellSummary}
                    icon={<Shield size={32} color="#52525b" />}
                    actionLabel={guardianCtaLabel}
                    onAction={() => router.push('/settings/plans-billing')}
                  />
                ) : guardianItems.length > 0 ? (
                  guardianItems.map(item => {
                    const displayItem = {
                      ...item,
                      time: formatGuardianDueLabel(item.deadlineAt),
                      guardianInsight: getDisplayText(
                        item.aiInsight || (item as any).insight,
                        'AI: Reminder Guardian is keeping this deadline prioritized.'
                      ),
                    };

                    return (
                      <EventCard
                        key={item.id}
                        item={displayItem}
                        userPlan={userPlan}
                        type="protected"
                        onClick={() => setSelectedProtectedReminder(displayItem as Reminder)}
                      />
                    );
                  })
                ) : (
                  <EmptyState
                    message="No protected reminders"
                    subtext="Reminder Guardian has no reminders to show right now."
                    icon={<Shield size={32} color="#52525b" />}
                  />
                )}
              </View>
            </View>

            {/* 2) UP NEXT */}
            <View className="mb-10">
              <View className="flex-row justify-between items-end px-1 mb-6">
                <View className="flex-row items-center gap-2.5">
                  <Text className="text-two-xl font-sans-extrabold text-white">Up Next</Text>
                  <View className="w-[6px] h-[6px] rounded-full bg-[#E91E63] mt-[2px]" />
                </View>
                <TouchableOpacity onPress={() => router.push('/reminders')}>
                  <Text variant="micro" className="text-accent-purple pb-1.5">Full View</Text>
                </TouchableOpacity>
              </View>

              <View className="gap-4">
                {upNextReminders.length > 0 ? (
                  upNextReminders.map(item => (
                    <EventCard
                      key={item.id}
                      item={item}
                      userPlan={userPlan}
                      onClick={() => router.push(`/reminders/${item.id}`)}
                    />
                  ))
                ) : (
                  <EmptyState
                    message="No reminders yet"
                    subtext="Create one to get started."
                    icon={<CheckCircle size={32} color="#52525b" />}
                    actionLabel="Create"
                    onAction={() => router.push('/create')}
                  />
                )}
              </View>
            </View>

            {/* TODO: Activity History hided for now */}

          </ScrollView>

          <ProtectedInfoSheet
            visible={!!selectedProtectedReminder}
            reminder={selectedProtectedReminder}
            onClose={() => setSelectedProtectedReminder(null)}
          />
        </SafeAreaView>
      )}
    </View>
  );
}
