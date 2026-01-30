import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useReminders } from '@/hooks/useReminders';
import { EventCard } from '@/components/EventCard';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { Theme } from '@/theme';
import { Reminder } from '@/types';

type FilterType = 'all' | 'upcoming' | 'risk' | 'history';

export default function AllRemindersScreen() {
    const router = useRouter();
    const { reminders, isLoading, refetch, toggleReminder } = useReminders();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // Filter Logic
    const filteredReminders = useMemo(() => {
        console.log('--- AllReminders Debug ---');
        console.log('Total Reminders:', reminders.length);
        console.log('Search Query:', searchQuery);
        console.log('Active Filter:', activeFilter);

        let result = reminders;

        // 1. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r =>
                (r.title && r.title.toLowerCase().includes(query)) ||
                (r.note && r.note.toLowerCase().includes(query)) ||
                (r.location && r.location.toLowerCase().includes(query))
            );
        }

        // 2. Tab Filter
        const now = new Date();
        const isPast = (r: Reminder) => {
            const d = new Date(`${r.date}T${r.time}:00`);
            return d < now;
        };

        switch (activeFilter) {
            case 'upcoming':
                result = result.filter(r => !isPast(r) && r.status !== 'completed');
                break;
            case 'risk':
                result = result.filter(r =>
                    r.priority === 'high' ||
                    r.priority === 'must' ||
                    r.risk ||
                    r.decisionControl?.hardDeadline?.enabled
                );
                break;
            case 'history':
                result = result.filter(r => isPast(r) || r.status === 'completed');
                break;
            case 'all':
            default:
                // No extra filter
                break;
        }

        console.log('Filtered Count:', result.length);

        // Sort: Upcoming (nearest first), History (newest first)
        return result.sort((a, b) => {
            const da = new Date(`${a.date}T${a.time}:00`).getTime();
            const db = new Date(`${b.date}T${b.time}:00`).getTime();
            if (activeFilter === 'history') {
                return db - da; // Newest past event first
            }
            return da - db; // Nearest future event first
        });

    }, [reminders, searchQuery, activeFilter]);

    const FilterChip = ({ label, value }: { label: string, value: FilterType }) => (
        <TouchableOpacity
            onPress={() => setActiveFilter(value)}
            className={`px-5 py-2.5 rounded-full border ${activeFilter === value
                ? 'bg-white border-white'
                : 'bg-zinc-900/50 border-white/10 active:bg-zinc-800'
                }`}
        >
            <Text
                variant="caption"
                weight="bold"
                className={activeFilter === value ? 'text-black' : 'text-zinc-400'}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-bg-primary">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-2 pb-6 flex-row items-center gap-4 border-b border-white/5 bg-bg-primary z-10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 items-center justify-center active:bg-zinc-800"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-sans-bold text-white flex-1">All Reminders</Text>
                </View>

                {/* Search & Filter Container */}
                <View className="px-6 pt-6 pb-2">
                    {/* Search Bar */}
                    <View className="flex-row items-center h-12 bg-zinc-900/80 rounded-2xl border border-white/5 px-4 mb-6">
                        <Search size={20} color="#71717a" />
                        <TextInput
                            className="flex-1 ml-3 text-white font-sans-medium text-base h-full"
                            placeholder="Search reminders..."
                            placeholderTextColor="#71717a"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            selectionColor={Theme.colors.accentPurple}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={18} color="#71717a" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Filter Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
                        className="mb-2"
                    >
                        <FilterChip label="All" value="all" />
                        <FilterChip label="Upcoming" value="upcoming" />
                        <FilterChip label="Risk & Protected" value="risk" />
                        <FilterChip label="History" value="history" />
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={filteredReminders}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 10, gap: 16 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        // Check if past logic for dimming
                        const isPast = new Date(`${item.date}T${item.time}:00`) < new Date();
                        const isDimmed = isPast && item.status !== 'completed';

                        return (
                            <EventCard
                                item={item}
                                userPlan="Free" // Or fetch real user plan if needed, default to free/safe
                                dimmed={isDimmed} // Use the new dimmed prop!
                                onClick={() => router.push(`/reminders/${item.id}`)}
                                onToggle={() => toggleReminder(item.id, item.status === 'completed' ? 'active' : 'completed')}
                            />
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <SlidersHorizontal size={40} color="#3f3f46" />
                            <Text className="text-zinc-600 mt-4 font-sans-medium text-center">
                                No reminders found matching{'\n'}your filters.
                            </Text>
                        </View>
                    }
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            </SafeAreaView>
        </View>
    );
}
