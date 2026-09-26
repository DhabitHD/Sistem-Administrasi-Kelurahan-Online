import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, getToken, getStoredUser, setToken, storeUser, ApiError } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  /* Bumped by login()/logout() so an in-flight GET /auth/me that resolves after
     the session ended cannot resurrect it (isLoggedIn true, token already gone). */
  const epoch = useRef(0);

  useEffect(() => {
    if (!getToken()) return;
    const at = epoch.current;
    api
      .get('/auth/me')
      .then((u) => { if (epoch.current === at) setUser(u); })
      .catch((err) => {
        /* Only an actual 401 means the session is gone. A timeout, 500 or a dead
           connection must not throw a still-valid token away — the resident cannot
           log back in while offline, and would have to re-enter credentials. */
        if (!(err instanceof ApiError) || err.status !== 401) return;
        if (epoch.current !== at) return;
        setToken(null);
        storeUser(null);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    /* The 401 interceptor in api.js already cleared the token before firing this
       event. Bump the epoch too, otherwise an in-flight GET /auth/me still passes
       the epoch check above and resurrects a session whose token is already gone. */
    const on401 = () => {
      epoch.current++;
      setUser(null);
    };
    window.addEventListener('betet:logged-out', on401);
    return () => window.removeEventListener('betet:logged-out', on401);
  }, []);

  const applyUser = (u) => {
    storeUser(u);
    setUser(u);
    return u;
  };

  const login = async (identity, password) => {
    try {
      const { token, user: u } = await api.post('/auth/login', { identity, password });
      epoch.current++;
      setToken(token);
      return { user: applyUser(u) };
    } catch (err) {
      return { error: err instanceof ApiError ? err.message : 'Gagal masuk. Coba lagi.' };
    }
  };

  const register = async (form) => {
    /* Never send the password confirmation or the base64 KTP data URL as part of
       the JSON body — `confirm` is a client-side-only concern, and posting it means
       the plaintext confirmation is in the request log / interceptor path. */
    const { confirm, ktp, ...body } = form;
    const { nik } = await api.post('/auth/register', { ...body, ktp: ktp || null });
    return nik;
  };

  const refreshUser = async () => {
    try {
      return applyUser(await api.get('/auth/me'));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setToken(null);
        storeUser(null);
        setUser(null);
      }
      return null;
    }
  };

  const updateUser = (updated) => applyUser(updated);

  const logout = async () => {
    epoch.current++;
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