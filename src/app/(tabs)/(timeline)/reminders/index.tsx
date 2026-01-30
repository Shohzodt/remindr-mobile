import React, { useState } from "react";
import { View, SectionList, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { ReminderRow } from "@/components/ReminderRow";
import { EmptyState } from "@/components/EmptyState";
import { useReminders } from "@/hooks/useReminders";
import { ReminderCategory } from "@/types";
import { Search, ArrowLeft, Filter, ChevronDown } from "lucide-react-native";
import { Layout } from "@/constants/layout";

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work', category: ReminderCategory.WORK },
  { id: 'personal', label: 'Personal', category: ReminderCategory.PERSONAL },
  { id: 'social', label: 'Social', category: ReminderCategory.SOCIAL },
  { id: 'risk', label: 'High Risk' },
];

export default function RemindersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { reminders, isLoading, refetch, toggleReminder } = useReminders();

  const handleToggle = async (id: string, newStatus: string) => {
    setTogglingId(id);
    try {
      await toggleReminder(id, newStatus);
    } finally {
      setTogglingId(null);
    }
  };

  // Filter Logic
  const filteredReminders = reminders.filter(item => {
    // 1. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(query) &&
        !item.note?.toLowerCase().includes(query)) {
        return false;
      }
    }

    // 2. Category Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'risk') return item.priority === 'high' || item.priority === 'must' || item.risk === 'High';

    // Match strict categories
    const filterDef = FILTERS.find(f => f.id === activeFilter);
    return filterDef?.category ? item.category === filterDef.category : true;
  });

  // Grouping Logic
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const overdue = filteredReminders.filter(r => r.date < todayStr && r.status !== 'completed');
  const today = filteredReminders.filter(r => r.date === todayStr);
  const upcoming = filteredReminders.filter(r => r.date > todayStr);

  const sections = [
    { title: 'Overdue', data: overdue },
    { title: 'Today', data: today },
    { title: 'Upcoming', data: upcoming }
  ].filter(s => s.data.length > 0);

  return (
    <View className="flex-1 bg-bg-primary">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-6 pt-2 pb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <Text variant="h2" weight="extrabold" className="text-white">All Reminders</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/create')}
            className="bg-white px-4 py-2 rounded-full active:opacity-90"
          >
            <Text weight="bold" className="text-black">+ Create</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar & Filter Button */}
        <View className="px-6 mb-8 flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-logo-container px-4 h-12 rounded-2xl border border-white/5 focus:border-accent-purple/50">
            <Search size={20} color="#71717a" />
            <TextInput
              placeholder="Search reminders..."
              placeholderTextColor="#71717a"
              className="flex-1 ml-3 text-white h-full"
              style={{
                fontFamily: 'PlusJakartaSans_400Regular',
                textAlignVertical: 'center',
                paddingVertical: 0
              }}
              autoCapitalize="none"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-2xl bg-logo-container border border-white/5 items-center justify-center active:bg-white/5">
            <Filter size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Grouped List (SectionList) */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ ...Layout.tabBarAwareContent, paddingHorizontal: 24 }}
          stickySectionHeadersEnabled={false}
          onRefresh={refetch}
          refreshing={isLoading}
          renderSectionHeader={({ section: { title } }) => (
            <View className="flex-row items-center gap-2 mb-4 mt-2">
              <ChevronDown size={16} color="#71717a" />
              <Text variant="micro" className="text-text-muted text-[11px]">{title}</Text>
              <View className="h-[1px] flex-1 bg-white/5 ml-2" />
            </View>
          )}
          renderItem={({ item }) => (
            <ReminderRow
              item={item}
              onToggle={() => handleToggle(item.id, item.status === 'completed' ? 'active' : 'completed')}
              onDelete={() => { }}
              isLoading={togglingId === item.id}
              onPress={() => router.push(`/reminders/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View className="mt-10">
              <EmptyState
                message="No matches found"
                subtext={searchQuery ? `No results for "${searchQuery}"` : "You have no reminders in this category."}
                icon={<Filter size={32} color="#52525b" />}
              />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
