import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { EventCard } from '@/components/EventCard';
import { SoftLockPlaceholder } from '@/components/SoftLockPlaceholder';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useRemindersMock } from '@/hooks/useRemindersMock';
import { Bell, CheckCircle, Shield, AlertTriangle, Plus } from 'lucide-react-native';
import { Layout } from "@/constants/layout";

export default function TimelineScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Assuming useAuth provides user object
  const { reminders } = useRemindersMock(new Date().toISOString().split('T')[0]);
  const { top: insetsTop } = useSafeAreaInsets();
  const isAuthenticated = !!user;

  // Logic from Web
  const userPlan = 'Premium' as 'Premium' | 'Free' | 'Pro'; // Mocked for now to show all features
  const isFree = userPlan === 'Free';
  const showUrgency = !isFree;

  // Mocked filtering
  const protectedDeadlines = reminders.filter(r => r.isGuardian || r.priority === 'must');
  const lockedInReminders = reminders.filter(r => r.decisionControl?.hardDeadline?.enabled);
  const riskReminders = reminders.filter(r => r.priority === 'high' || r.risk); // Rough mapping
  const upNextReminders = reminders.filter(r => !r.isGuardian && !r.decisionControl?.hardDeadline?.enabled); // Everything else
  const pastReminders: import('@/types').Reminder[] = []; // Mock empty for now

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-1 bg-bg-primary">
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            ...Layout.tabBarAwareContent,
            paddingTop: 20,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View className="flex-row justify-between items-start mb-10">
            <View>
              <Text variant="h1" weight="extrabold" className="text-white mb-2">Timeline</Text>
              <Text variant="body" weight="medium" className="text-text-muted">
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push('/reminders')} // Assuming notifications route match
                className="p-2.5 bg-white/5 rounded-full border border-white/10 active:scale-95 items-center justify-center relative"
              >
                <Bell size={20} color="#ffffff" />
                <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#050505]" />
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

          {/* 1) PROTECTED TRACKING */}
          <View className="mb-12">
            <Text variant="micro" className="text-text-dim mb-5 pl-1">Protected tracking</Text>
            <View className="gap-3">
              {isFree ? (
                <SoftLockPlaceholder
                  title="Autonomous Protection"
                  description="Monitor high-consequence contracts automatically."
                />
              ) : protectedDeadlines.length > 0 ? (
                protectedDeadlines.map(item => (
                  <EventCard
                    key={item.id}
                    item={item}
                    userPlan={userPlan}
                    type="protected"
                    onClick={() => { }}
                  />
                ))
              ) : (
                <EmptyState
                  message="All Systems Secure"
                  subtext="No protected deadlines requiring attention this week."
                  icon={<Shield size={32} color="#52525b" />}
                />
              )}
            </View>
          </View>

          {/* 2) RISK MONITORING */}
          <View className="mb-12">
            <Text variant="micro" className="text-text-dim mb-5 pl-1">Risk monitoring</Text>
            <View className="gap-3">
              {isFree ? (
                <SoftLockPlaceholder
                  title="Risk Engine"
                  description="Prioritize events based on urgency and potential impact."
                />
              ) : (lockedInReminders.length > 0 || riskReminders.length > 0) ? (
                <>
                  {lockedInReminders.map(item => (
                    <EventCard
                      key={item.id}
                      item={item}
                      userPlan={userPlan}
                      type="risk"
                      onClick={() => { }}
                    />
                  ))}
                  {riskReminders.map(item => (
                    <EventCard
                      key={item.id}
                      item={item}
                      userPlan={userPlan}
                      type="risk"
                      onClick={() => { }}
                    />
                  ))}
                </>
              ) : (
                <EmptyState
                  message="Zero Hazards"
                  subtext="No locked-in commitments or risks detected."
                  icon={<AlertTriangle size={32} color="#52525b" />}
                />
              )}
            </View>
          </View>

          {/* 3) UP NEXT */}
          <View className="mb-12">
            <View className="flex-row justify-between items-end px-1 mb-6">
              <View className="flex-row items-center gap-2.5">
                <Text variant="h3" weight="extrabold" className="text-white">Up Next</Text>
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
                    onClick={() => { }}
                  />
                ))
              ) : (
                <EmptyState
                  message="No reminders yet"
                  subtext="Create one to get started."
                  icon={<CheckCircle size={32} color="#52525b" />}
                  actionLabel="Create"
                  onAction={() => { }}
                />
              )}
            </View>
          </View>

          {/* 4) ACTIVITY HISTORY */}
          <View className="mt-8 pt-8 border-t border-white/5 pb-10">
            <Text variant="micro" className="text-text-dim mb-6 pl-1">Activity history</Text>
            <View className="gap-3">
              {pastReminders.length > 0 ? (
                pastReminders.map(item => (
                  // Simple placeholder for history item
                  <View key={item.id}><Text className="text-white">{item.title}</Text></View>
                ))
              ) : (
                <Text variant="micro" className="text-text-dim text-center py-6">No previous records</Text>
              )}
            </View>

            <Text variant="micro" className="text-center text-zinc-800 mt-12 mb-4 tracking-[0.2em]">
              Timeline Protected by Remindr
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
