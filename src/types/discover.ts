export type DiscoverImageType =
    | 'music'
    | 'theater'
    | 'cinema'
    | 'exhibition'
    | 'sport'
    | 'kids'
    | 'culture'
    | 'other';

export type DiscoverCategoryKey =
    | 'all'
    | 'tech'
    | 'music'
    | 'sports'
    | 'art'
    | 'food'
    | 'other';

export type DiscoverItemCategory =
    | 'tech'
    | 'music'
    | 'sports'
    | 'art'
    | 'food'
    | 'other';

export type DiscoverSourceKey = 'afisha_uz' | 'manual' | string;

export type DiscoverItem = {
    id: string;
    title: string;
    summary?: string;
    category: DiscoverItemCategory;
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
        key: DiscoverSourceKey;
        name: string;
    };
    sourceUrl?: string;
    canAddToReminder?: boolean;
};
