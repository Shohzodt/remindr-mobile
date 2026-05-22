import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenStorage } from '../services/storage';
import { AuthService } from '../services/auth';
import { authEvents } from '../services/auth.events';
import { isAuthFailureStatus } from '@/utils/http';

import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string | null, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
  refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearLocalSession = async () => {
    await TokenStorage.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await TokenStorage.getAccessToken();
        const refreshToken = await TokenStorage.getRefreshToken();

        if (!accessToken && !refreshToken) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        if (!accessToken && refreshToken) {
          const restoredAccessToken = await AuthService.refreshAccessToken();
          if (!restoredAccessToken) {
            await clearLocalSession();
            return;
          }
        }

        try {
          const userProfile = await AuthService.getProfile();
          if (!userProfile || !userProfile.id) {
            console.warn('Invalid stored session, logging out.');
            await clearLocalSession();
            return;
          }
          setUser(userProfile);
          setIsAuthenticated(true);
        } catch (profileError: any) {
          const status = profileError.response?.status;
          if (isAuthFailureStatus(status)) {
            await clearLocalSession();
            return;
          }

          console.warn('Auth check could not verify profile, keeping stored tokens:', profileError?.message || profileError);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error: any) {
        const status = error.response?.status;
        if (isAuthFailureStatus(status)) {
          console.log('Session expired or invalid, logging out.');
          await clearLocalSession();
          return;
        }

        console.warn('Auth check failed, keeping stored tokens:', error?.message || error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to global logout events (from api interceptor)
    const unsubscribe = authEvents.subscribe(() => {
      clearLocalSession();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string | null, code: string) => {
    try {
      setIsLoading(true);
      await AuthService.login(email, code);

      // Fetch fresh profile
      const userProfile = await AuthService.getProfile();
      if (!userProfile) {
        throw new Error('Invalid user profile');
      }
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    try {
      const userProfile = await AuthService.getProfile();
      if (userProfile) {
        setUser(userProfile);
      }
    } catch (error) {
      console.warn('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
