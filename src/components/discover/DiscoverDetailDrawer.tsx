import React from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ExternalLink, MapPin, X } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { Theme } from '@/theme';

export type DiscoverImageType =
    | 'music'
    | 'theater'
    | 'cinema'
    | 'exhibition'
    | 'sport'
    | 'kids'
    | 'culture'
    | 'other';

export type DiscoverItem = {
    id: string;
    title: string;
    summary?: string;
    category: string;
    categoryColor: string;
    date: string;
    startsAt?: string;
    endsAt?: string;
    venue?: string;
    location?: string;
    city?: string;
    country?: string;
    image?: string;
    imageUrl?: string;
    imageType?: DiscoverImageType;
    source?: {
        key: 'afisha_uz' | 'manual';
        name: string;
    };
    sourceUrl?: string;
};

type DiscoverDetailDrawerProps = {
    visible: boolean;
    item: DiscoverItem | null;
    onClose: () => void;
    onAddReminder: (item: DiscoverItem, notifyBeforeMinutes: number[]) => void | Promise<void>;
    isAdding?: boolean;
};

const DISCOVER_NOTIFY_BEFORE_MINUTES = [4320, 1440, 60];

const getVisualColors = (item: DiscoverItem) => {
    const accent = item.categoryColor || Theme.colors.accentPurple;

    return ['rgba(255,255,255,0.08)', `${accent}66`, 'rgba(0,0,0,0.92)'] as const;
};

const getLocationLabel = (item: DiscoverItem) => {
    return item.venue || item.location || [item.city, item.country].filter(Boolean).join(', ');
};

export function DiscoverDetailDrawer({
    visible,
    item,
    onClose,
    onAddReminder,
    isAdding = false,
}: DiscoverDetailDrawerProps) {
    const insets = useSafeAreaInsets();

    if (!item) return null;

    const imageUri = item.imageUrl || item.image;
    const hasDate = Boolean(item.startsAt);
    const locationLabel = getLocationLabel(item);
    const sourceName = item.source?.name;

    const openSource = () => {
        if (!item.sourceUrl) return;

        Linking.openURL(item.sourceUrl).catch(() => {
            Alert.alert('Could not open source', 'Please try again later.');
        });
    };

    const handleAddReminder = () => {
        if (!hasDate || isAdding) return;
        onAddReminder(item, DISCOVER_NOTIFY_BEFORE_MINUTES);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <Pressable className="absolute inset-0 bg-black/80" onPress={onClose} />

                <View
                    className="relative overflow-hidden rounded-t-[34px] border border-white/10 bg-[#111114]"
                    style={{ height: '88%', paddingBottom: Math.max(insets.bottom, 20) }}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 18 }}
                    >
                        <View className="mb-6 overflow-hidden bg-white/[0.03]">
                            {imageUri ? (
                                <ImageBackground
                                    source={{ uri: imageUri }}
                                    style={{ aspectRatio: 16 / 9 }}
                                    resizeMode="cover"
                                >
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.22)', 'rgba(0,0,0,0.9)']}
                                        locations={[0, 0.38, 1]}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'flex-end',
                                            padding: 20,
                                        }}
                                    >
                                        <View className="mb-1.5 flex-row items-center gap-2">
                                            <Text
                                                variant="micro"
                                                weight="extrabold"
                                                style={{ color: item.categoryColor, fontSize: 10, letterSpacing: 2 }}
                                            >
                                                {item.category}
                                            </Text>
                                            <View className="h-1 w-1 rounded-full bg-white/40" />
                                            <Text
                                                variant="micro"
                                                weight="bold"
                                                style={{ color: 'rgba(255,255,255,0.78)', fontSize: 10, letterSpacing: 1.5 }}
                                            >
                                                {hasDate ? item.date : 'DATE TBD'}
                                            </Text>
                                        </View>

                                        <Text
                                            variant="h2"
                                            weight="extrabold"
                                            className="text-white tracking-tight"
                                            style={{ fontSize: 22, lineHeight: 26 }}
                                            numberOfLines={2}
                                        >
                                            {item.title}
                                        </Text>

                                        {!!locationLabel && (
                                            <View className="mt-1.5 flex-row items-center gap-1.5">
                                                <MapPin size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                                                <Text
                                                    variant="caption"
                                                    weight="medium"
                                                    className="flex-1"
                                                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                                    numberOfLines={1}
                                                >
                                                    {locationLabel}
                                                </Text>
                                            </View>
                                        )}
                                    </LinearGradient>
                                </ImageBackground>
                            ) : (
                                <LinearGradient
                                    colors={getVisualColors(item)}
                                    style={{
                                        aspectRatio: 16 / 9,
                                        justifyContent: 'flex-end',
                                        padding: 20,
                                    }}
                                >
                                    <View className="mb-1.5 flex-row items-center gap-2">
                                        <Text
                                            variant="micro"
                                            weight="extrabold"
                                            style={{ color: item.categoryColor, fontSize: 10, letterSpacing: 2 }}
                                        >
                                            {item.category}
                                        </Text>
                                        <View className="h-1 w-1 rounded-full bg-white/40" />
                                        <Text
                                            variant="micro"
                                            weight="bold"
                                            style={{ color: 'rgba(255,255,255,0.78)', fontSize: 10, letterSpacing: 1.5 }}
                                        >
                                            {hasDate ? item.date : 'DATE TBD'}
                                        </Text>
                                    </View>

                                    <Text
                                        variant="h2"
                                        weight="extrabold"
                                        className="text-white tracking-tight"
                                        style={{ fontSize: 22, lineHeight: 26 }}
                                        numberOfLines={2}
                                    >
                                        {item.title}
                                    </Text>

                                    {!!locationLabel && (
                                        <View className="mt-1.5 flex-row items-center gap-1.5">
                                            <MapPin size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                                            <Text
                                                variant="caption"
                                                weight="medium"
                                                className="flex-1"
                                                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                                numberOfLines={1}
                                            >
                                                {locationLabel}
                                            </Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            )}
                        </View>

                        {!!sourceName && (
                            <View className="mx-6 mb-7 rounded-[24px] border border-white/5 bg-white/[0.03] p-5">
                                <Text variant="micro" className="mb-3 text-text-dim">
                                    Source
                                </Text>
                                <View className="flex-row items-center justify-between gap-4">
                                    <Text className="flex-1 text-[14px] font-sans-bold text-white">
                                        Source: {sourceName}
                                    </Text>

                                    {!!item.sourceUrl && (
                                        <TouchableOpacity
                                            onPress={openSource}
                                            activeOpacity={0.8}
                                            className="flex-row items-center gap-1.5"
                                        >
                                            <Text variant="caption" className="text-text-muted">
                                                Open on {sourceName}
                                            </Text>
                                            <ExternalLink size={14} color="#71717a" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}

                        <View className="mx-6 mb-7 rounded-[24px] border border-white/5 bg-white/[0.03] p-5">
                            <View className="flex-row items-center gap-3">
                                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-accent-purple/10">
                                    <Bell size={18} color={Theme.colors.accentPurple} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[14px] font-sans-bold text-white">
                                        Reminder coverage
                                    </Text>
                                    <Text variant="caption" className="mt-1 text-text-muted">
                                        We will remind you early, the day before, and one hour before it starts.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleAddReminder}
                        disabled={!hasDate || isAdding}
                        activeOpacity={0.9}
                        className="mx-6 mb-1 h-16 shadow-lg shadow-purple-500/20"
                    >
                        <LinearGradient
                            colors={!hasDate || isAdding ? ['#202022', '#202022'] : ['#d946ef', '#9333ea']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isAdding ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text className={`text-lg font-sans-bold ${hasDate ? 'text-white' : 'text-zinc-500'}`}>
                                    {hasDate ? 'Remind Me' : 'Date not available'}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute right-6 top-6 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35"
                        activeOpacity={0.8}
                    >
                        <X size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
