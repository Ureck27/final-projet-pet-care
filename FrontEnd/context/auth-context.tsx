'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; role?: string }>;
  adminLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string; role?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Only attempt to fetch user if we might have a token
        // Check if we're on an auth page or if there might be a cookie
        const hasPossibleAuth = document.cookie.includes('token=');

        if (!hasPossibleAuth) {
          // No token cookie found, user is not authenticated
          setUser(null);
          setIsLoading(false);
          return;
        }

        const userData = await authApi.getMe();
        setUser(userData as unknown as User);
      } catch (err: any) {
        // Handle 401 gracefully - user is not logged in
        if (err.status === 401) {
          // This is expected when user is not logged in, don't log as error
          setUser(null);
        } else {
          console.error('[Auth] Failed to fetch user:', err.message);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; role?: string }> => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });

      const loggedUser: User = {
        _id: data._id,
        id: data._id,
        email: data.email,
        name: data.name,
        fullName: data.name,
        phone: '',
        role: data.role as UserRole,
        status: (data.status as any) || 'accepted',
        createdAt: new Date(),
      };
      setUser(loggedUser);
      setIsLoading(false);
      return { success: true, role: loggedUser.role };
    } catch (err: any) {
      let errorMessage = 'Login failed';

      // Handle specific error types
      if (err.isRateLimit) {
        errorMessage = `Rate limit exceeded. Please try again in ${err.retryAfter}.`;
      } else if (err.message && err.message.includes('BACKEND_DOWN')) {
        errorMessage = 'Server is currently unavailable. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('[Auth Error] Login failed:', errorMessage);
      setIsLoading(false);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const adminLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; role?: string }> => {
    setIsLoading(true);
    try {
      const data = await authApi.adminLogin({ email, password });

      const loggedUser: User = {
        _id: data._id,
        id: data._id,
        email: data.email,
        name: data.name,
        fullName: data.name,
        phone: '',
        role: data.role as UserRole,
        status: (data.status as any) || 'accepted',
        createdAt: new Date(),
      };
      setUser(loggedUser);
      setIsLoading(false);
      return { success: true, role: loggedUser.role };
    } catch (err: any) {
      let errorMessage = 'Admin Login failed';

      // Handle rate limiting errors specifically
      if (err.isRateLimit) {
        errorMessage = `Rate limit exceeded. Please try again in ${err.retryAfter}.`;
      } else if (err.message && err.message.includes('BACKEND_DOWN')) {
        errorMessage = 'Server is currently unavailable. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('[Auth Error] Admin Login failed:', errorMessage);
      setIsLoading(false);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const register = async (
    data: RegisterData,
  ): Promise<{ success: boolean; message?: string; role?: string }> => {
    setIsLoading(true);
    try {
      const resData = await authApi.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });

      const newUser: User = {
        _id: resData._id,
        id: resData._id,
        email: resData.email,
        name: resData.name,
        fullName: resData.name,
        phone: data.phone,
        role: resData.role as UserRole,
        status: 'pending', // All new users are pending
        createdAt: new Date(),
      };
      setUser(newUser);
      setIsLoading(false);
      return { success: true, role: newUser.role };
    } catch (err: any) {
      let errorMessage = 'Registration failed';

      // Handle specific error types
      if (err.isRateLimit) {
        errorMessage = `Rate limit exceeded. Please try again in ${err.retryAfter}.`;
      } else if (err.message && err.message.includes('BACKEND_DOWN')) {
        errorMessage = 'Server is currently unavailable. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('[Auth Error] Registration failed:', errorMessage);
      setIsLoading(false);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setUser(null);
      // Fallback cleanup if token is still cached somehow
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await authApi.forgotPassword(email);
      return true;
    } catch (err: any) {
      console.error('[Auth Error] Forgot password failed:', err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, adminLogin, register, logout, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
