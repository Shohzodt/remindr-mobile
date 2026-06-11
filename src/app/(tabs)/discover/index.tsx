import React, { useState } from 'react';
import {
    Alert,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/Text';
import { DiscoverDetailDrawer, type DiscoverItem } from '@/components/discover/DiscoverDetailDrawer';
import { Layout } from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';
import { RemindersService } from '@/services/reminders.service';
import { isProPlan } from '@/utils/plan';

// ─── Mock Data ──────────────────────────────────────────────────────
const FEATURED_EVENTS: DiscoverItem[] = [
    {
        id: '1',
        title: 'Neon Dreams Tour',
        category: 'MUSIC',
        categoryColor: '#C084FC',
        date: 'OCT 24',
        startsAt: '2026-10-24T20:00:00-04:00',
        summary: 'Get reminded before tickets, start time, or deadlines.',
        venue: 'Madison Square Garden',
        location: 'Madison Square Garden, NY',
        city: 'New York',
        country: 'US',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
        imageType: 'music',
        source: { key: 'afisha_uz', name: 'Afisha.uz' },
        sourceUrl: 'https://www.afisha.uz/',
    },
    {
        id: '2',
        title: 'Filmmakers Summit',
        category: 'FESTIVAL',
        categoryColor: '#FB923C',
        date: 'TOMORROW',
        startsAt: '2026-06-10T19:00:00-07:00',
        summary: 'Track the opening time, ticket windows, and schedule updates for this experience.',
        venue: 'The Dolby Theatre',
        location: 'The Dolby Theatre, LA',
        city: 'Los Angeles',
        country: 'US',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
        imageType: 'cinema',
        source: { key: 'afisha_uz', name: 'Afisha.uz' },
        sourceUrl: 'https://www.afisha.uz/',
    },
    {
        id: '3',
        title: 'AI & Future Tech',
        category: 'TECH',
        categoryColor: '#38BDF8',
        date: 'NOV 12',
        startsAt: '2026-11-12T09:00:00-08:00',
        summary: 'Stay ahead of registration deadlines, session starts, and last-minute venue changes.',
        venue: 'Moscone Center',
        location: 'Moscone Center, SF',
        city: 'San Francisco',
        country: 'US',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        imageType: 'other',
        source: { key: 'afisha_uz', name: 'Afisha.uz' },
        sourceUrl: 'https://www.afisha.uz/',
    },
];

const EXPERIENCE_EVENTS: DiscoverItem[] = [
    {
        id: '4',
        title: 'Modern Gallery Opening',
        category: 'ART',
        categoryColor: '#FBBF24',
        date: 'FRI, 7 PM',
        startsAt: '2026-06-12T19:00:00-04:00',
        summary: 'A curated opening night reminder for arrival time, RSVP windows, and venue details.',
        venue: 'MoMA West Wing',
        location: 'MoMA West Wing, 5th Ave',
        city: 'New York',
        country: 'US',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80',
        imageType: 'exhibition',
        source: { key: 'afisha_uz', name: 'Afisha.uz' },
        sourceUrl: 'https://www.afisha.uz/',
    },
    {
        id: '5',
        title: 'Rooftop Jazz',
        category: 'MUSIC',
        categoryColor: '#C084FC',
        date: '8:00 PM',
        startsAt: '2026-06-09T20:00:00-04:00',
        summary: 'Set a reminder before the set starts so you have time to arrive and settle in.',
        venue: 'The Skylight Lounge',
        location: 'The Skylight Lounge, Dow...',
        city: 'New York',
        country: 'US',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
        imageType: 'music',
        source: { key: 'afisha_uz', name: 'Afisha.uz' },
        sourceUrl: 'https://www.afisha.uz/',
    },
];

const CATEGORIES = ['Recommended', 'Tech', 'Music', 'Sports', 'Art', 'Food'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_GAP = 14;
const SHOW_DISCOVER_CONTENT = true;

// ─── Featured Card ──────────────────────────────────────────────────
function FeaturedCard({
    item,
    onPress,
    onRemindPress,
}: {
    item: DiscoverItem;
    onPress: () => void;
    onRemindPress: () => void;
}) {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLiked(prev => !prev);
    };

    const handleRemind = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRemindPress();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.92}
            style={[styles.featuredCard, { width: CARD_WIDTH }]}
        >
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.featuredImage}
                imageStyle={{ borderRadius: 22 }}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.85)']}
                    locations={[0, 0.45, 1]}
                    style={styles.featuredGradient}
                >
                    {/* Heart Button */}
                    <TouchableOpacity
                        onPress={handleLike}
                        activeOpacity={0.7}
                        style={styles.heartButton}
                    >
                        <Heart
                            size={18}
                            color={liked ? '#F472B6' : 'rgba(255,255,255,0.7)'}
                            fill={liked ? '#F472B6' : 'transparent'}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>

                    {/* Card Content */}
                    <View style={styles.featuredContent}>
                        {/* Category + Date Row */}
                        <View className="flex-row items-center gap-2 mb-1.5">
                            <Text
                                variant="micro"
                                weight="extrabold"
                                style={{ color: item.categoryColor, fontSize: 10, letterSpacing: 2 }}
                            >
                                {item.category}
                            </Text>
                            <View className="w-1 h-1 rounded-full bg-white/40" />
                            <Text
                                variant="micro"
                                weight="bold"
                                style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, letterSpacing: 1.5 }}
                            >
                                {item.date}
                            </Text>
                        </View>

                        {/* Title */}
                        <Text
                            variant="h2"
                            weight="extrabold"
                            className="text-white tracking-tight"
                            style={{ fontSize: 22, lineHeight: 26 }}
                        >
                            {item.title}
                        </Text>

                        {/* Location */}
                        <View className="flex-row items-center gap-1.5 mt-1.5">
                            <MapPin size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                            <Text
                                variant="caption"
                                weight="medium"
                                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            >
                                {item.location}
                            </Text>
                        </View>

                        {/* Remind Me Button */}
                        <TouchableOpacity
                            onPress={handleRemind}
                            activeOpacity={0.8}
                            style={styles.remindButton}
                        >
                            <Text
                                variant="caption"
                                weight="extrabold"
                                style={{ color: '#fff', fontSize: 13, letterSpacing: 1.5 }}
                            >
                                REMIND ME
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

// ─── Category Chip ──────────────────────────────────────────────────
function CategoryChip({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.chip,
                active ? styles.chipActive : styles.chipInactive,
            ]}
        >
            <Text
                variant="caption"
                weight="extrabold"
                style={[
                    styles.chipText,
                    { color: active ? '#000' : 'rgba(255,255,255,0.45)' },
                ]}
            >
                {label.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );
}

// ─── Experience Card (Grid) ─────────────────────────────────────────
function ExperienceCard({
    item,
    onPress,
    onRemindPress,
}: {
    item: DiscoverItem;
    onPress: () => void;
    onRemindPress: () => void;
}) {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLiked(prev => !prev);
    };

    const handleRemind = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRemindPress();
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={styles.experienceCard}>
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.experienceImage}
                imageStyle={{ borderRadius: 18 }}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.88)']}
                    locations={[0, 0.35, 1]}
                    style={styles.experienceGradient}
                >
                    {/* Heart */}
                    <TouchableOpacity
                        onPress={handleLike}
                        activeOpacity={0.7}
                        style={styles.heartButtonSmall}
                    >
                        <Heart
                            size={14}
                            color={liked ? '#F472B6' : 'rgba(255,255,255,0.6)'}
                            fill={liked ? '#F472B6' : 'transparent'}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>

                    {/* Content */}
                    <View style={styles.experienceContent}>
                        <View className="flex-row items-center gap-1.5 mb-1">
                            <Text
                                variant="micro"
                                weight="extrabold"
                                style={{ color: item.categoryColor, fontSize: 9, letterSpacing: 1.5 }}
                            >
                                {item.category}
                            </Text>
                            <Text
                                variant="micro"
                                weight="bold"
                                style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 1 }}
                            >
                                {item.date}
                            </Text>
                        </View>

                        <Text
                            variant="h3"
                            weight="extrabold"
                            className="text-white"
                            style={{ fontSize: 16, lineHeight: 20 }}
                        >
                            {item.title}
                        </Text>

                        <View className="flex-row items-center gap-1 mt-1">
                            <MapPin size={10} color="rgba(255,255,255,0.45)" strokeWidth={2} />
                            <Text
                                variant="caption"
                                weight="medium"
                                style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}
                                numberOfLines={1}
                            >
                                {item.location}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleRemind}
                            activeOpacity={0.8}
                            style={styles.remindButtonSmall}
                        >
                            <Text
                                variant="caption"
                                weight="extrabold"
                                style={{ color: '#fff', fontSize: 11, letterSpacing: 1.2 }}
                            >
                                REMIND ME
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

// ─── Main Screen ────────────────────────────────────────────────────
export default function DiscoverScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState(0);
    const [selectedDiscoverItem, setSelectedDiscoverItem] = useState<DiscoverItem | null>(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isAddingDiscoverReminder, setIsAddingDiscoverReminder] = useState(false);
    const isProUser = isProPlan(user?.plan);

    const handleCategoryPress = (index: number) => {
        Haptics.selectionAsync();
        setActiveCategory(index);
    };

    const handleOpenDrawer = (item: DiscoverItem) => {
        Haptics.selectionAsync();
        setSelectedDiscoverItem(item);
        setIsDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        if (isAddingDiscoverReminder) return;
        setIsDrawerVisible(false);
    };

    const handleAddReminder = async (item: DiscoverItem, notifyBefore: number[]) => {
        if (!isProUser) {
            setIsDrawerVisible(false);

            try {
                router.push('/settings/plans-billing');
            } catch {
                Alert.alert('Discover reminder', 'Adding Discover items is a Pro feature.');
            }

            return;
        }

        setIsAddingDiscoverReminder(true);

        try {
            await RemindersService.addDiscoverReminder(item.id, { notifyBefore });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsDrawerVisible(false);
            Alert.alert('Reminder added', 'This Discover item was added to your reminders.');
        } catch (error) {
            console.warn('Add Discover reminder failed', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Reminder not added', 'Discover reminders are not available yet. Please try again later.');
        } finally {
            setIsAddingDiscoverReminder(false);
        }
    };

    if (!SHOW_DISCOVER_CONTENT) {
        return (
            <View className="flex-1 items-center justify-center bg-black px-8">
                <Text className="text-center text-white text-2xl font-sans-extrabold">
                    Coming soon...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-bg-primary">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    ...Layout.tabBarAwareContent,
                    paddingTop: insets.top + 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* ─── Header ───────────────────────────────────── */}
                <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
                    <Text
                        variant="hero"
                        weight="extrabold"
                        className="text-white"
                        style={{ fontSize: 38, lineHeight: 42 }}
                    >
                        Discover
                    </Text>
                    <Text
                        variant="body"
                        weight="medium"
                        style={{ color: 'rgba(255,255,255,0.35)', marginTop: 10, fontSize: 14, lineHeight: 20 }}
                    >
                        "Get reminded before tickets, start time, or{'\n'}deadlines."
                    </Text>
                </View>

                {/* ─── Featured Picks ────────────────────────────── */}
                <View style={{ marginBottom: 32 }}>
                    {/* Section Header */}
                    <View
                        className="flex-row items-center justify-between"
                        style={{ paddingHorizontal: 24, marginBottom: 16 }}
                    >
                        <Text
                            variant="micro"
                            weight="extrabold"
                            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: 3, fontSize: 11 }}
                        >
                            FEATURED PICKS
                        </Text>
                        <Text
                            variant="micro"
                            weight="bold"
                            style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: 2, fontSize: 10 }}
                        >
                            EDITORIAL
                        </Text>
                    </View>

                    {/* Carousel */}
                    <FlatList
                        data={FEATURED_EVENTS}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                        snapToInterval={CARD_WIDTH + CARD_GAP}
                        decelerationRate="fast"
                        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                        renderItem={({ item }) => (
                            <FeaturedCard
                                item={item}
                                onPress={() => handleOpenDrawer(item)}
                                onRemindPress={() => handleOpenDrawer(item)}
                            />
                        )}
                    />
                </View>

                {/* ─── Category Chips ────────────────────────────── */}
                <View style={{ marginBottom: 36 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
                    >
                        {CATEGORIES.map((cat, idx) => (
                            <CategoryChip
                                key={cat}
                                label={cat}
                                active={idx === activeCategory}
                                onPress={() => handleCategoryPress(idx)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* ─── More Experiences ──────────────────────────── */}
                <View style={{ paddingHorizontal: 24 }}>
                    {/* Section Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text
                            variant="micro"
                            weight="extrabold"
                            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: 3, fontSize: 11 }}
                        >
                            MORE EXPERIENCES
                        </Text>
                        <Text
                            variant="micro"
                            weight="bold"
                            style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: 2, fontSize: 10 }}
                        >
                            {EXPERIENCE_EVENTS.length} ITEMS
                        </Text>
                    </View>

                    {/* Grid */}
                    <View className="flex-row gap-3">
                        {EXPERIENCE_EVENTS.map(item => (
                            <ExperienceCard
                                key={item.id}
                                item={item}
                                onPress={() => handleOpenDrawer(item)}
                                onRemindPress={() => handleOpenDrawer(item)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            <DiscoverDetailDrawer
                visible={isDrawerVisible}
                item={selectedDiscoverItem}
                onClose={handleCloseDrawer}
                onAddReminder={handleAddReminder}
                isAdding={isAddingDiscoverReminder}
            />
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    // Featured Card
    featuredCard: {
        borderRadius: 22,
        overflow: 'hidden',
    },
    featuredImage: {
        height: 420,
    },
    featuredGradient: {
        flex: 1,
        borderRadius: 22,
        justifyContent: 'flex-end',
        padding: 20,
    },
    featuredContent: {
        // Content sits at the bottom of the gradient
    },
    heartButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    remindButton: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },

    // Category Chip
    chip: {
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 1,
    },
    chipActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    chipInactive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.08)',
    },
    chipText: {
        fontSize: 12,
        letterSpacing: 1.5,
    },

    // Experience Card (Grid)
    experienceCard: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
    },
    experienceImage: {
        height: 300,
    },
    experienceGradient: {
        flex: 1,
        borderRadius: 18,
        justifyContent: 'flex-end',
        padding: 14,
    },
    experienceContent: {},
    heartButtonSmall: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    remindButtonSmall: {
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        paddingVertical: 11,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
});
