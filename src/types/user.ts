export interface User {
    id: string;
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    provider: string;
    createdAt: string;
}
