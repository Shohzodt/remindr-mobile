export type MeetingProvider = 'google_meet' | 'teams' | 'zoom';
export type MapProvider = 'google_maps' | 'yandex_maps';
export type LocationProvider = MeetingProvider | MapProvider;

export interface ParsedLocation {
    raw: string;
    type: 'meeting' | 'location' | 'text';
    provider?: LocationProvider;
    url?: string;
}

const MEETING_PROVIDERS: { id: MeetingProvider; name: string; regex: RegExp }[] = [
    {
        id: 'google_meet',
        name: 'Google Meet',
        regex: /(?:https?:\/\/)?(?:meet\.google\.com|google\.com\/meet)\/[a-zA-Z0-9-]+/i,
    },
    {
        id: 'teams',
        name: 'Microsoft Teams',
        regex: /(?:https?:\/\/)?(?:teams\.microsoft\.com|teams\.live\.com)\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+/i,
    },
    {
        id: 'zoom',
        name: 'Zoom',
        regex: /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?zoom\.us\/(?:j|my)\/[a-zA-Z0-9]+/i,
    },
];

const MAP_PROVIDERS: { id: MapProvider; name: string; regex: RegExp }[] = [
    {
        id: 'google_maps',
        name: 'Google Maps',
        // Matches: maps.google.com, google.com/maps, goo.gl/maps, maps.app.goo.gl
        regex: /(?:https?:\/\/)?(?:(?:maps\.google\.[a-z.]+|google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl))[^\s]*/i,
    },
    {
        id: 'yandex_maps',
        name: 'Yandex Maps',
        // Matches: yandex.com/maps, yandex.ru/maps, yandex.ru/navi, maps.yandex.com, maps.yandex.ru
        regex: /(?:https?:\/\/)?(?:yandex\.(?:com|ru|uz|kz)\/(?:maps|navi)|maps\.yandex\.(?:com|ru|uz|kz))[^\s]*/i,
    },
];

export const PROVIDER_CONFIG: Record<LocationProvider, { color: string; bg: string; label: string; icon: 'video' | 'map' }> = {
    // Meeting providers
    google_meet: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Google Meet', icon: 'video' },
    teams: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', label: 'Microsoft Teams', icon: 'video' },
    zoom: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', label: 'Zoom', icon: 'video' },
    // Map providers
    google_maps: { color: '#ea4335', bg: 'rgba(234, 67, 53, 0.15)', label: 'Google Maps', icon: 'map' },
    yandex_maps: { color: '#fc3f1d', bg: 'rgba(252, 63, 29, 0.15)', label: 'Yandex Maps', icon: 'map' },
};

/**
 * Smartly detects meeting links and map links in a text string.
 * Returns the detected provider and URL, or falls back to 'text' type.
 */
export const parseLocation = (text: string): ParsedLocation => {
    if (!text) {
        return { raw: text, type: 'text' };
    }

    // First, check for meeting providers
    for (const provider of MEETING_PROVIDERS) {
        const match = text.match(provider.regex);
        if (match) {
            let url = match[0];
            url = url.replace(/[.,)]+$/, '');
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            return {
                raw: text,
                type: 'meeting',
                provider: provider.id,
                url: url,
            };
        }
    }

    // Then, check for map providers
    for (const provider of MAP_PROVIDERS) {
        const match = text.match(provider.regex);
        if (match) {
            let url = match[0];
            url = url.replace(/[.,)]+$/, '');
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            return {
                raw: text,
                type: 'location',
                provider: provider.id,
                url: url,
            };
        }
    }

    return { raw: text, type: 'text' };
};

