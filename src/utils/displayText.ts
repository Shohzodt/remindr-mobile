export const getDisplayText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (!value || typeof value !== 'object') return fallback;

    const record = value as Record<string, unknown>;
    const title = getDisplayText(record.title);
    const description = getDisplayText(record.description || record.desc || record.summary);

    if (title && description) return `${title}: ${description}`;
    return title || description || fallback;
};
