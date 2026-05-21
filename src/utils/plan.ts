export type NormalizedPlan = 'free' | 'pro';

export const normalizePlan = (plan?: string | null): NormalizedPlan => {
    return String(plan || 'free').trim().toLowerCase() === 'pro' ? 'pro' : 'free';
};

export const isProPlan = (plan?: string | null) => {
    return normalizePlan(plan) === 'pro';
};

export const getPlanDisplayName = (plan?: string | null) => {
    return normalizePlan(plan) === 'pro' ? 'Pro' : 'Free';
};
