import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data && res.data.success) {
      const authData = res.data.data;
      const jwtToken = authData.token;
      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
        phone: authData.phone,
        state: authData.state,
        district: authData.district
      };

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    } else {
      throw new Error(res.data?.message || 'Login failed');
    }
  };

  const register = async (registerData) => {
    const res = await authApi.register(registerData);
    if (res.data && res.data.success) {
      const authData = res.data.data;
      const jwtToken = authData.token;
      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
        phone: authData.phone,
        state: authData.state,
        district: authData.district
      };

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    } else {
      throw new Error(res.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    try {
      authApi.logout();
    } catch (e) {
      // ignore
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    isLandowner: user?.role === 'ROLE_LANDOWNER',
    isFarmer: user?.role === 'ROLE_FARMER',
    isAdmin: user?.role === 'ROLE_ADMIN'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

