import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, getStoredUser, setToken, storeUser, ApiError } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (!getToken()) return;
    api
      .get('/auth/me')
      .then((u) => setUser(u))
      .catch(() => {
        setToken(null);
        storeUser(null);
        setUser(null);
      });
  }, []);

  const applyUser = (u) => {
    storeUser(u);
    setUser(u);
    return u;
  };

  const login = async (identity, password) => {
    try {
      const { token, user: u } = await api.post('/auth/login', { identity, password });
      setToken(token);
      return { user: applyUser(u) };
    } catch (err) {
      return { error: err instanceof ApiError ? err.message : 'Gagal masuk. Coba lagi.' };
    }
  };

  const register = async (form) => {
    const { nik } = await api.post('/auth/register', { ...form, ktp: form.ktp || null });
    return nik;
  };

  const refreshUser = async () => {
    try {
      const u = await applyUser(await api.get('/auth/me'));
      return u;
    } catch {
      return null;
    }
  };

  const updateUser = (updated) => applyUser(updated);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* token mungkin sudah invalid */
    }
    setToken(null);
    storeUser(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isLoggedIn: !!user, login, logout, register, updateUser, refreshUser }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);