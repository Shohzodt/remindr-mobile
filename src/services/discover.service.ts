import { apiClient } from './api.client';
import type { DiscoverCategoryKey, DiscoverImageType, DiscoverItem, DiscoverItemCategory } from '@/types/discover';

export interface AddDiscoverReminderPayload {
    notifyBefore: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    music: '#C084FC',
    tech: '#38BDF8',
    art: '#FBBF24',
    sports: '#34D399',
    food: '#F97316',
    other: '#8B5CF6',
};

const IMAGE_TYPE_BY_CATEGORY: Record<string, DiscoverImageType> = {
    music: 'music',
    art: 'exhibition',
    sports: 'sport',
    tech: 'other',
    food: 'other',
    other: 'other',
};

const DISCOVER_ITEM_CATEGORIES = new Set<DiscoverItemCategory>([
    'tech',
    'music',
    'sports',
    'art',
    'food',
    'other',
]);

const asString = (value: unknown) => {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

const getArrayPayload = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.discoverItems)) return payload.discoverItems;
    return [];
};

const getSinglePayload = (payload: any): any => {
    return payload?.item || payload?.data || payload;
};

const formatDiscoverDate = (startsAt?: string) => {
    if (!startsAt) return 'DATE TBD';

    const date = new Date(startsAt);
    if (Number.isNaN(date.getTime())) return 'DATE TBD';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'TODAY';
    if (date.toDateString() === tomorrow.toDateString()) return 'TOMORROW';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    }).toUpperCase();
};

const normalizeCategory = (value: unknown): DiscoverItemCategory => {
    const category = asString(value)?.toLowerCase();
    return category && DISCOVER_ITEM_CATEGORIES.has(category as DiscoverItemCategory)
        ? category as DiscoverItemCategory
        : 'other';
};

const normalizeSource = (raw: any) => {
    const source = raw?.source || raw?.discoverSource;
    const name = asString(source?.name)
        || asString(source?.title)
        || asString(source?.label)
        || asString(source?.displayName)
        || asString(raw?.sourceName)
        || asString(raw?.sourceTitle)
        || asString(raw?.sourceLabel);
    if (!name) return undefined;

    return {
        key: asString(source?.key)
            || asString(source?.slug)
            || asString(source?.id)
            || asString(raw?.sourceKey)
            || 'manual',
        name,
    };
};

export const normalizeDiscoverItem = (raw: any): DiscoverItem => {
    const category = normalizeCategory(raw?.category || raw?.type);
    const categoryKey = category.toLowerCase();
    const startsAt = asString(raw?.startsAt) || asString(raw?.startAt) || asString(raw?.date);
    const imageUrl = asString(raw?.imageUrl) || asString(raw?.image) || asString(raw?.posterUrl);
    const venue = asString(raw?.venue) || asString(raw?.venueName);
    const city = asString(raw?.city);
    const country = asString(raw?.country);
    const location = asString(raw?.location)
        || [venue, city, country].filter(Boolean).join(', ')
        || undefined;

    return {
        id: String(raw?.id || raw?._id || ''),
        title: asString(raw?.title) || 'Untitled event',
        summary: asString(raw?.summary) || asString(raw?.description),
        category,
        categoryColor: CATEGORY_COLORS[categoryKey] || '#8B5CF6',
        date: formatDiscoverDate(startsAt),
        startsAt,
        endsAt: asString(raw?.endsAt) || asString(raw?.endAt),
        venue,
        location,
        city,
        country,
        image: imageUrl,
        imageUrl,
        imageType: (asString(raw?.imageType) as DiscoverImageType | undefined)
            || IMAGE_TYPE_BY_CATEGORY[categoryKey]
            || 'other',
        source: normalizeSource(raw),
        sourceUrl: asString(raw?.sourceUrl) || asString(raw?.externalUrl) || asString(raw?.url),
        canAddToReminder: typeof raw?.canAddToReminder === 'boolean' ? raw.canAddToReminder : undefined,
    };
};

export const DiscoverService = {
    async getAll(): Promise<DiscoverItem[]> {
        const response = await apiClient.get('/discover');
        return getArrayPayload(response.data)
            .map(normalizeDiscoverItem)
            .filter(item => Boolean(item.id));
    },

    async getByCategory(categoryKey: Exclude<DiscoverCategoryKey, 'all'>): Promise<DiscoverItem[]> {
        const response = await apiClient.get('/discover', {
            params: { category: categoryKey },
        });

        return getArrayPayload(response.data)
            .map(normalizeDiscoverItem)
            .filter(item => Boolean(item.id));
    },

    async getOne(id: string): Promise<DiscoverItem> {
        const response = await apiClient.get(`/discover/${id}`);
        return normalizeDiscoverItem(getSinglePayload(response.data));
    },

    async addReminder(id: string, payload: AddDiscoverReminderPayload) {
        const response = await apiClient.post(`/discover/${id}/add-reminder`, payload);
        return response.data;
    },
};
