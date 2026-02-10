import { useState, useCallback } from 'react';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { LinkEmailPayload, LinkTelegramPayload } from '@/types';

interface UseSecuritySettingsReturn {
    // Link states
    isLinkEmailModalOpen: boolean;
    isLinkTelegramModalOpen: boolean;
    openLinkEmailModal: () => void;
    closeLinkEmailModal: () => void;
    openLinkTelegramModal: () => void;
    closeLinkTelegramModal: () => void;
    // Link actions
    linkEmail: (payload: LinkEmailPayload) => Promise<boolean>;
    linkTelegram: (payload: LinkTelegramPayload) => Promise<boolean>;
    // Logout actions
    logoutAll: () => Promise<void>;
    logoutCurrent: () => Promise<void>;
    // Status
    isLinking: boolean;
    isLoggingOut: boolean;
    error: string | null;
    clearError: () => void;
    // Computed
    isTelegramLinked: boolean;
    isEmailLinked: boolean;
}

export const useSecuritySettings = (): UseSecuritySettingsReturn => {
    const { user, refreshUser, logout } = useAuth();

    const [isLinkEmailModalOpen, setLinkEmailModalOpen] = useState(false);
    const [isLinkTelegramModalOpen, setLinkTelegramModalOpen] = useState(false);
    const [isLinking, setIsLinking] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isTelegramLinked = user?.provider === 'telegram';
    const isEmailLinked = !!user?.email;

    const clearError = useCallback(() => setError(null), []);

    const openLinkEmailModal = useCallback(() => {
        setError(null);
        setLinkEmailModalOpen(true);
    }, []);
    const closeLinkEmailModal = useCallback(() => {
        setError(null);
        setLinkEmailModalOpen(false);
    }, []);
    const openLinkTelegramModal = useCallback(() => {
        setError(null);
        setLinkTelegramModalOpen(true);
    }, []);
    const closeLinkTelegramModal = useCallback(() => {
        setError(null);
        setLinkTelegramModalOpen(false);
    }, []);

    const linkEmail = useCallback(async (payload: LinkEmailPayload): Promise<boolean> => {
        setError(null);
        setIsLinking(true);
        try {
            await AuthService.linkEmail(payload);
            await refreshUser();
            setLinkEmailModalOpen(false);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to link email');
            return false;
        } finally {
            setIsLinking(false);
        }
    }, [refreshUser]);

    const linkTelegram = useCallback(async (payload: LinkTelegramPayload): Promise<boolean> => {
        setError(null);
        setIsLinking(true);
        try {
            await AuthService.linkTelegram(payload);
            await refreshUser();
            setLinkTelegramModalOpen(false);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to link Telegram');
            return false;
        } finally {
            setIsLinking(false);
        }
    }, [refreshUser]);

    const logoutAll = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await AuthService.logoutAll();
            // Clear local auth state after logout-all
            await logout();
        } catch (err: any) {
            console.error('Logout all failed:', err);
        } finally {
            setIsLoggingOut(false);
        }
    }, [logout]);

    const logoutCurrent = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    }, [logout]);

    return {
        isLinkEmailModalOpen,
        isLinkTelegramModalOpen,
        openLinkEmailModal,
        closeLinkEmailModal,
        openLinkTelegramModal,
        closeLinkTelegramModal,
        linkEmail,
        linkTelegram,
        logoutAll,
        logoutCurrent,
        isLinking,
        isLoggingOut,
        error,
        clearError,
        isTelegramLinked,
        isEmailLinked,
    };
};
