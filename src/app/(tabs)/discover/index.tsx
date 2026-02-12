import React, { useState, useRef } from 'react';
import {
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/Text';
import { Layout } from '@/constants/layout';

// ─── Types ──────────────────────────────────────────────────────────
interface EventItem {
    id: string;
    title: string;
    category: string;
    categoryColor: string;
    date: string;
    location: string;
    image: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────
const FEATURED_EVENTS: EventItem[] = [
    {
        id: '1',
        title: 'Neon Dreams Tour',
        category: 'MUSIC',
        categoryColor: '#C084FC',
        date: 'OCT 24',
        location: 'Madison Square Garden, NY',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    },
    {
        id: '2',
        title: 'Filmmakers Summit',
        category: 'FESTIVAL',
        categoryColor: '#FB923C',
        date: 'TOMORROW',
        location: 'The Dolby Theatre, LA',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    },
    {
        id: '3',
        title: 'AI & Future Tech',
        category: 'TECH',
        categoryColor: '#38BDF8',
        date: 'NOV 12',
        location: 'Moscone Center, SF',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    },
];

const EXPERIENCE_EVENTS: EventItem[] = [
    {
        id: '4',
        title: 'Modern Gallery Opening',
        category: 'ART',
        categoryColor: '#FBBF24',
        date: 'FRI, 7 PM',
        location: 'MoMA West Wing, 5th Ave',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80',
    },
    {
        id: '5',
        title: 'Rooftop Jazz',
        category: 'MUSIC',
        categoryColor: '#C084FC',
        date: '8:00 PM',
        location: 'The Skylight Lounge, Dow...',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
    },
];

const CATEGORIES = ['Recommended', 'Tech', 'Music', 'Sports', 'Art', 'Food'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_GAP = 14;

// ─── Featured Card ──────────────────────────────────────────────────
function FeaturedCard({ item }: { item: EventItem }) {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLiked(prev => !prev);
    };

    const handleRemind = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View style={[styles.featuredCard, { width: CARD_WIDTH }]}>
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
        </View>
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
function ExperienceCard({ item }: { item: EventItem }) {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLiked(prev => !prev);
    };

    const handleRemind = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View style={styles.experienceCard}>
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
        </View>
    );
}

// ─── Main Screen ────────────────────────────────────────────────────
export default function DiscoverScreen() {
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = useState(0);

    const handleCategoryPress = (index: number) => {
        Haptics.selectionAsync();
        setActiveCategory(index);
    };

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
                        renderItem={({ item }) => <FeaturedCard item={item} />}
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
                            <ExperienceCard key={item.id} item={item} />
                        ))}
                    </View>
                </View>
            </ScrollView>
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
