import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { apiClient } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setLoading(false);
    localStorage.removeItem('auth_token');
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient('/auth/me', {
        method: 'GET',
        token,
      });
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });

    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refetchProfile: fetchProfile,
    }),
    [fetchProfile, loading, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
