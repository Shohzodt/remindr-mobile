export type MeetingProvider = 'google_meet' | 'teams' | 'zoom';

export interface ParsedLocation {
    raw: string;
    type: 'meeting' | 'text';
    provider?: MeetingProvider;
    url?: string;
}

const PROVIDERS: { id: MeetingProvider; name: string; regex: RegExp }[] = [
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

export const PROVIDER_CONFIG: Record<MeetingProvider, { color: string; bg: string; label: string }> = {
    google_meet: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Google Meet' },
    teams: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', label: 'Microsoft Teams' },
    zoom: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', label: 'Zoom' },
};

/**
 * Smartly detects meeting links in a text string.
 * Returns the detected provider and URL, or falls back to 'text' type.
 */
export const parseLocation = (text: string): ParsedLocation => {
    if (!text) {
        return { raw: text, type: 'text' };
    }

    // Iterate through providers to find the first match
    for (const provider of PROVIDERS) {
        const match = text.match(provider.regex);
        if (match) {
            // Ensure the URL has a protocol for Linking.openURL
            let url = match[0];

            // Basic cleanup of trailing punctuation if regex caught it (though regex aims to be safe)
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

    return { raw: text, type: 'text' };
};
