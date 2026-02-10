import { useState, useCallback } from 'react';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { UpdateProfilePayload } from '@/types';

interface UseProfileInfoReturn {
    displayName: string;
    setDisplayName: (name: string) => void;
    email: string;
    isSaving: boolean;
    error: string | null;
    hasChanges: boolean;
    save: () => Promise<boolean>;
}

export const useProfileInfo = (): UseProfileInfoReturn => {
    const { user, refreshUser } = useAuth();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const email = user?.email || '';
    const hasChanges = displayName !== (user?.displayName || '');

    const save = useCallback(async (): Promise<boolean> => {
        if (!hasChanges) return true;

        setError(null);
        setIsSaving(true);

        try {
            const payload: UpdateProfilePayload = { displayName };
            await AuthService.updateProfile(payload);
            // Refresh user in AuthContext
            await refreshUser();
            return true;
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [displayName, hasChanges, refreshUser]);

    return {
        displayName,
        setDisplayName,
        email,
        isSaving,
        error,
        hasChanges,
        save,
    };
};
