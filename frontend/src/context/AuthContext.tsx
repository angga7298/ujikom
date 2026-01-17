import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { User, AuthContextType, AuthResponse, CheckAuthResponse } from '../types'

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await api.get<CheckAuthResponse>('/api/auth/check');
      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', {
        username,
        password,
      });
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        return { 
          success: true,
          user: response.data.user 
        };
      }
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', {
        username,
        email,
        password,
      });
      
      if (response.data.success) {
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  // TAMBAH FUNGSI INI UNTUK UPDATE USER
  const updateUser = (userData: User | null) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    checkAuth,
    setUser: updateUser, // TAMBAHKAN INI
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};