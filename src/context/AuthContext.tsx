import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenStorage } from '../services/storage';
import { AuthService } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithTelegram: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  loginWithGoogle: async () => {},
  loginWithTelegram: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          // Optional: Validate token with backend or try refresh
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    try {
      setIsLoading(true);
      await AuthService.loginWithGoogle(idToken);
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
      await AuthService.loginWithTelegram(data);
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
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
