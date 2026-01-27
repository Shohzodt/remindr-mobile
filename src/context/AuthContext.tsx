import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenStorage } from '../services/storage';
import { AuthService } from '../services/auth';

import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithTelegram: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  loginWithGoogle: async () => { },
  loginWithTelegram: async () => { },
  logout: async () => { },
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
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        // If profile fetch fails, token might be invalid
        await TokenStorage.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.loginWithGoogle(idToken); // Sets tokens internally

      // Fetch fresh profile
      const userProfile = await AuthService.getProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTelegram = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await AuthService.loginWithTelegram(data);
      await TokenStorage.setTokens(response.accessToken, response.refreshToken);

      // Fetch fresh profile
      const userProfile = await AuthService.getProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Telegram login failed', error);
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        loginWithGoogle,
        loginWithTelegram,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
