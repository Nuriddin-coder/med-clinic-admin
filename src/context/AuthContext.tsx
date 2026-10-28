import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth.types';
import { loginApi, LoginDto } from '@/api/auth.api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('med_admin_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('med_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const res = await loginApi(dto);
      const userWithDetails: AuthUser = {
        ...res.user,
        name: res.user.username.toUpperCase(),
        email: `${res.user.username}@medclinic.uz`,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      };
      localStorage.setItem('med_admin_token', res.access_token);
      localStorage.setItem('med_admin_user', JSON.stringify(userWithDetails));
      setToken(res.access_token);
      setUser(userWithDetails);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('med_admin_token');
    localStorage.removeItem('med_admin_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

