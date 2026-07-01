import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Setup request or load user from storage
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const decodeToken = (tkn) => {
    try {
      const base64Url = tkn.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.data.requireMfa) {
      return { requireMfa: true, userId: data.data.userId };
    }

    const { token: receivedToken, user: loggedUser } = data.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(loggedUser);
    return { success: true };
  };

  const verifyMfaCode = async (userId, code) => {
    const res = await fetch('/api/v1/auth/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'MFA validation failed');
    }

    const { token: receivedToken, user: loggedUser } = data.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(loggedUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      logout();
    }
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, verifyMfaCode, logout, fetchWithAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
