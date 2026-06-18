import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleProp,
    View,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ImageStyle,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Heart, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/EmptyState';
import { DiscoverDetailDrawer } from '@/components/discover/DiscoverDetailDrawer';
import { Layout } from '@/constants/layout';
import { useAuth } from '@/context/AuthContext';
import { useAddDiscoverReminder, useDiscoverCategoryItems, useDiscoverFeaturedItems } from '@/hooks/useDiscover';
import { isProPlan } from '@/utils/plan';
import type { DiscoverCategoryKey, DiscoverItem } from '@/types/discover';

const CATEGORIES: Array<{ key: DiscoverCategoryKey; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'tech', label: 'Tech' },
    { key: 'music', label: 'Music' },
    { key: 'sports', label: 'Sports' },
    { key: 'art', label: 'Art' },
    { key: 'food', label: 'Food' },
    { key: 'other', label: 'Other' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_GAP = 14;
const EXPERIENCE_CARD_GAP = 12;
const EXPERIENCE_CARD_WIDTH = (SCREEN_WIDTH - 48 - EXPERIENCE_CARD_GAP) / 2;
const SHOW_DISCOVER_CONTENT = true;

const getCardFallbackColors = (item: DiscoverItem) => {
    return ['rgba(255,255,255,0.08)', `${item.categoryColor}66`, 'rgba(0,0,0,0.92)'] as const;
};

const formatCategoryLabel = (category: string) => category.toUpperCase();

function DiscoverCardBackground({
    item,
    style,
    imageStyle,
    gradientColors,
    gradientLocations,
    gradientStyle,
    children,
}: {
    item: DiscoverItem;
    style: StyleProp<ViewStyle>;
    imageStyle: StyleProp<ImageStyle>;
    gradientColors: readonly [string, string, string];
    gradientLocations: readonly [number, number, ...number[]];
    gradientStyle: StyleProp<ViewStyle>;
    children: React.ReactNode;
}) {
    const imageUri = item.imageUrl || item.image;

    if (imageUri) {
        return (
            <ImageBackground
                source={{ uri: imageUri }}
                style={style}
                imageStyle={imageStyle}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={gradientColors}
                    locations={gradientLocations}
                    style={gradientStyle}
                >
                    {children}
                </LinearGradient>
            </ImageBackground>
        );
    }

    return (
        <LinearGradient
            colors={getCardFallbackColors(item)}
            locations={[0, 0.45, 1]}
            style={[style, gradientStyle]}
        >
            {children}
        </LinearGradient>
    );
}

// ─── Featured Card ──────────────────────────────────────────────────
function FeaturedCard({
    item,
    isAdded,
    onPress,
    onRemindPress,
}: {
    item: DiscoverItem;
    isAdded: boolean;
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
            <DiscoverCardBackground
                item={item}
                style={styles.featuredImage}
                imageStyle={{ borderRadius: 22 }}
                gradientColors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.85)']}
                gradientLocations={[0, 0.45, 1]}
                gradientStyle={styles.featuredGradient}
            >
                <TouchableOpacity
                    onPress={handleLike}
                    activeOpacity={0.7}
                    style={styles.heartButton}
                >
                    <Heart
                        size={18}
                        color={liked ? '#F472B6' : '#FFFFFF'}
                        fill={liked ? '#F472B6' : 'transparent'}
                        strokeWidth={2.25}
                    />
                </TouchableOpacity>

                <View style={styles.featuredContent}>
                    <View className="flex-row items-center gap-2 mb-1.5">
                        <Text
                            variant="micro"
                            weight="extrabold"
                            style={{ color: item.categoryColor, fontSize: 10, letterSpacing: 2 }}
                        >
                            {formatCategoryLabel(item.category)}
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

                    <Text
                        variant="h2"
                        weight="extrabold"
                        className="text-white tracking-tight"
                        style={{ fontSize: 22, lineHeight: 26 }}
                    >
                        {item.title}
                    </Text>

                    {!!item.location && (
                        <View className="flex-row items-center gap-1.5 mt-1.5">
                            <MapPin size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                            <Text
                                variant="caption"
                                weight="medium"
                                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                numberOfLines={1}
                            >
                                {item.location}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleRemind}
                        activeOpacity={0.8}
                        style={[styles.remindButton, isAdded && styles.remindButtonAdded]}
                    >
                        {isAdded && <CheckCircle size={15} color="#ffffff" />}
                        <Text
                            variant="caption"
                            weight="extrabold"
                            style={{ color: '#fff', fontSize: 13, letterSpacing: 1.5 }}
                        >
                            {isAdded ? 'ADDED' : 'REMIND ME'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </DiscoverCardBackground>
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
    isAdded,
    onPress,
    onRemindPress,
}: {
    item: DiscoverItem;
    isAdded: boolean;
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
            <DiscoverCardBackground
                item={item}
                style={styles.experienceImage}
                imageStyle={{ borderRadius: 18 }}
                gradientColors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.88)']}
                gradientLocations={[0, 0.35, 1]}
                gradientStyle={styles.experienceGradient}
            >
                <TouchableOpacity
                    onPress={handleLike}
                    activeOpacity={0.7}
                    style={styles.heartButtonSmall}
                >
                    <Heart
                        size={14}
                        color={liked ? '#F472B6' : '#FFFFFF'}
                        fill={liked ? '#F472B6' : 'transparent'}
                        strokeWidth={2.25}
                    />
                </TouchableOpacity>

                <View style={styles.experienceContent}>
                    <View className="flex-row items-center gap-1.5 mb-1">
                        <Text
                            variant="micro"
                            weight="extrabold"
                            style={{ color: item.categoryColor, fontSize: 9, letterSpacing: 1.5 }}
                        >
                            {formatCategoryLabel(item.category)}
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
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>

                    {!!item.location && (
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
                    )}

                    <TouchableOpacity
                        onPress={handleRemind}
                        activeOpacity={0.8}
                        style={[styles.remindButtonSmall, isAdded && styles.remindButtonAdded]}
                    >
                        {isAdded && <CheckCircle size={13} color="#ffffff" />}
                        <Text
                            variant="caption"
                            weight="extrabold"
                            style={{ color: '#fff', fontSize: 11, letterSpacing: 1.2 }}
                        >
                            {isAdded ? 'ADDED' : 'REMIND ME'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </DiscoverCardBackground>
        </TouchableOpacity>
    );
}

// ─── Main Screen ────────────────────────────────────────────────────
export default function DiscoverScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState<DiscoverCategoryKey>('all');
    const isAllCategory = activeCategory === 'all';
    const activeBackendCategory = isAllCategory ? 'tech' : activeCategory;
    const {
        data: featuredDiscoverItems = [],
        isLoading: isFeaturedDiscoverLoading,
        isFetching: isFeaturedDiscoverFetching,
        error: featuredDiscoverError,
        refetch: refetchFeaturedDiscover,
    } = useDiscoverFeaturedItems();
    const {
        data: categoryDiscoverItems = [],
        isLoading: isCategoryDiscoverLoading,
        isFetching: isCategoryDiscoverFetching,
        error: categoryDiscoverError,
        refetch: refetchCategoryDiscover,
    } = useDiscoverCategoryItems(activeBackendCategory, !isAllCategory);
    const addDiscoverReminder = useAddDiscoverReminder();
    const [selectedDiscoverItem, setSelectedDiscoverItem] = useState<DiscoverItem | null>(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [addedDiscoverReminderIds, setAddedDiscoverReminderIds] = useState<Set<string>>(() => new Set());
    const [isPullRefreshing, setIsPullRefreshing] = useState(false);
    const isProUser = isProPlan(user?.plan);
    const activeCategoryLabel = CATEGORIES.find(category => category.key === activeCategory)?.label || 'All';
    const featuredEvents = featuredDiscoverItems.slice(0, 3);
    const experienceEvents = isAllCategory ? featuredDiscoverItems : categoryDiscoverItems;
    const isExperienceLoading = isAllCategory ? isFeaturedDiscoverLoading : isCategoryDiscoverLoading;
    const isExperienceFetching = isAllCategory ? isFeaturedDiscoverFetching : isCategoryDiscoverFetching;
    const experienceError = isAllCategory ? featuredDiscoverError : categoryDiscoverError;
    const isAddingDiscoverReminder = addDiscoverReminder.isPending;

    const handleCategoryPress = (categoryKey: DiscoverCategoryKey) => {
        Haptics.selectionAsync();
        setActiveCategory(categoryKey);
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

    const handleRefreshDiscover = async () => {
        if (isAllCategory) {
            await refetchFeaturedDiscover();
            return;
        }

        await Promise.all([
            refetchFeaturedDiscover(),
            refetchCategoryDiscover(),
        ]);
    };

    const handlePullRefreshDiscover = async () => {
        setIsPullRefreshing(true);

        try {
            await handleRefreshDiscover();
        } finally {
            setIsPullRefreshing(false);
        }
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

        try {
            const notifyBeforeMinutes = notifyBefore.includes(60) ? 60 : notifyBefore[0] ?? 60;

            await addDiscoverReminder.mutateAsync({
                id: item.id,
                payload: { notifyBefore: notifyBeforeMinutes },
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setAddedDiscoverReminderIds(prev => {
                const next = new Set(prev);
                next.add(item.id);
                return next;
            });
        } catch (error) {
            console.warn('Add Discover reminder failed', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            if ((error as any)?.response?.status === 403) {
                setIsDrawerVisible(false);
                try {
                    router.push('/settings/plans-billing');
                } catch {
                    Alert.alert('Discover reminder', 'Adding Discover items is a Pro feature.');
                }
                return;
            }

            const backendMessage = (error as any)?.response?.data?.message;
            const message = Array.isArray(backendMessage)
                ? backendMessage.join('\n')
                : backendMessage || 'Please try again later.';

            Alert.alert('Reminder not added', message);
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
                refreshControl={
                    <RefreshControl
                        refreshing={isPullRefreshing}
                        onRefresh={handlePullRefreshDiscover}
                        tintColor="#8B5CF6"
                    />
                }
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

                {isFeaturedDiscoverLoading ? (
                    <View className="items-center justify-center px-6 py-16">
                        <ActivityIndicator color="#8B5CF6" size="large" />
                    </View>
                ) : (
                    <>
                        {/* ─── Featured Picks ────────────────────────────── */}
                        {!featuredDiscoverError && featuredEvents.length > 0 && (
                            <View style={{ marginBottom: 32 }}>
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
                                        CURATED
                                    </Text>
                                </View>

                                <FlatList
                                    data={featuredEvents}
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
                                            isAdded={addedDiscoverReminderIds.has(item.id)}
                                            onPress={() => handleOpenDrawer(item)}
                                            onRemindPress={() => handleOpenDrawer(item)}
                                        />
                                    )}
                                />
                            </View>
                        )}

                        {/* ─── Category Chips ────────────────────────────── */}
                        <View style={{ marginBottom: 36 }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
                            >
                                {CATEGORIES.map(cat => (
                                    <CategoryChip
                                        key={cat.key}
                                        label={cat.label}
                                        active={cat.key === activeCategory}
                                        onPress={() => handleCategoryPress(cat.key)}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        {/* ─── More Experiences ──────────────────────────── */}
                        {isExperienceLoading ? (
                            <View className="items-center justify-center px-6 py-16">
                                <ActivityIndicator color="#8B5CF6" size="large" />
                            </View>
                        ) : experienceError ? (
                            <View className="px-6">
                                <EmptyState
                                    compact
                                    message="DISCOVER UNAVAILABLE"
                                    subtext="We could not load Discover right now."
                                    actionLabel="Retry"
                                    onAction={handleRefreshDiscover}
                                />
                            </View>
                        ) : experienceEvents.length === 0 ? (
                            <View className="px-6">
                                <EmptyState
                                    compact
                                    message={activeCategory === 'all' ? 'NO DISCOVER ITEMS' : 'NO ITEMS'}
                                    subtext={
                                        activeCategory === 'all'
                                            ? 'There are no Discover experiences to show yet.'
                                            : `No ${activeCategoryLabel.toLowerCase()} experiences are available yet.`
                                    }
                                    actionLabel={isExperienceFetching ? undefined : 'Refresh'}
                                    onAction={isExperienceFetching ? undefined : handleRefreshDiscover}
                                />
                            </View>
                        ) : experienceEvents.length > 0 && (
                            <View style={{ paddingHorizontal: 24 }}>
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
                                        {experienceEvents.length} ITEMS
                                    </Text>
                                </View>

                                <View style={styles.experienceGrid}>
                                    {experienceEvents.map(item => (
                                        <ExperienceCard
                                            key={item.id}
                                            item={item}
                                            isAdded={addedDiscoverReminderIds.has(item.id)}
                                            onPress={() => handleOpenDrawer(item)}
                                            onRemindPress={() => handleOpenDrawer(item)}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <DiscoverDetailDrawer
                visible={isDrawerVisible}
                item={selectedDiscoverItem}
                onClose={handleCloseDrawer}
                onAddReminder={handleAddReminder}
                isAdding={isAddingDiscoverReminder}
                isAdded={selectedDiscoverItem ? addedDiscoverReminderIds.has(selectedDiscoverItem.id) : false}
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
        backgroundColor: 'rgba(0,0,0,0.38)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.24)',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    remindButton: {
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 7,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    remindButtonAdded: {
        backgroundColor: 'rgba(139,92,246,0.18)',
        borderColor: 'rgba(139,92,246,0.32)',
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
        width: EXPERIENCE_CARD_WIDTH,
        borderRadius: 18,
        overflow: 'hidden',
    },
    experienceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: EXPERIENCE_CARD_GAP,
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
        backgroundColor: 'rgba(0,0,0,0.42)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.24)',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    remindButtonSmall: {
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        paddingVertical: 11,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
});
