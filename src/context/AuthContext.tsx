import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenStorage } from '../services/storage';
import { AuthService } from '../services/auth';
import { authEvents } from '../services/auth.events';

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          // Validate token and get user profile
          const userProfile = await AuthService.getProfile();
          if (!userProfile || !userProfile.id) {
            console.error('Invalid user profile received:', userProfile);
            throw new Error('Invalid user profile');
          }
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error('Auth check failed', error);
        } else {
          console.log('Session expired or invalid, logging out.');
        }
        // If profile fetch fails, token might be invalid
        await TokenStorage.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to global logout events (from api interceptor)
    const unsubscribe = authEvents.subscribe(() => {
      logout();
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
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
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
