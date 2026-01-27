
// Backend-compatible enums
export enum ReminderStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum ReminderSource {
    MANUAL = 'manual',
    DISCOVER = 'discover',
    IMPORT = 'import',
}

export enum ReminderCategory {
    WORK = 'work',
    PERSONAL = 'personal',
    SOCIAL = 'social',
    OTHER = 'other',
}

export enum ReminderPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    provider: 'google' | 'telegram';
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: User;
}


export type Plan = 'Free' | 'Pro' | 'Premium';

export interface PaymentMethod {
    last4: string;
    expiry: string;
    brand: string;
}

export interface SubscriptionMetadata {
    isCancelled: boolean;
    billingPeriodEnd: string;
}

export interface PrefillData {
    title: string;
    date: string;
    note: string;
    sourceDocName: string;
}

// Decision Control Types
export interface FutureImpactConfig {
    enabled: boolean;
    message?: string; // AI-generated or template-based consequence preview
}

export interface HardDeadlineConfig {
    enabled: boolean;
    lockedAt?: string; // ISO timestamp when commitment was made
}

export interface DecisionControlConfig {
    enabled: boolean;
    futureImpact?: FutureImpactConfig;
    hardDeadline?: HardDeadlineConfig;
    nudgeState?: 'pending' | 'shown' | 'dismissed' | 'engaged';
}

export type DecisionControlState =
    | 'none'           // Standard reminder
    | 'suggested'      // Nudge shown, awaiting response
    | 'dismissed'      // User dismissed nudge
    | 'active'         // At least one DC feature enabled
    | 'completed'      // Reminder marked done
    | 'missed';        // Hard deadline passed without completion

export interface Reminder {
    id: string;
    title: string;
    time: string;
    location?: string;
    category: ReminderCategory | string;
    date: string;
    note?: string;
    priority?: ReminderPriority | 'must' | 'should' | 'optional';
    aiInsight?: string;
    // Backend fields
    source?: ReminderSource;
    status?: ReminderStatus | 'active' | 'completed' | 'missed' | 'missed_protected';
    notifyAt?: string; // ISO timestamp (UTC) for when to notify
    notifyBefore?: number; // Minutes before reminder to notify
    // Guardian Fields
    isGuardian?: boolean;
    guardianSettings?: {
        escalation: '3_days' | '1_day' | 'on_miss';
        contact: string;
    };
    // Decision Control Fields
    decisionControl?: DecisionControlConfig;
    // UI helpers (from mock/web)
    color?: string; // Tailwind text color class, e.g. text-red-500
    risk?: string;  // 'High', 'Medium' etc
    days?: number;
}

export interface DiscoveryEvent {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    image: string;
    liked: boolean;
    description?: string;
}

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'urgent' | 'success';
    time: string;
    isRead: boolean;
}

// Navigation Types (Mobile specific)
// export type RootStackParamList = { ... } can go here later
