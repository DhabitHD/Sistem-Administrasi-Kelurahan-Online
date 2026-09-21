import axios from 'axios';

export const TOKEN_KEY = 'betet_token';
export const USER_KEY = 'betet_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const storeUser = (u) => (u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY));

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Terjadi kesalahan.';
    if (status === 401) {
      setToken(null);
      storeUser(null);
    }
    return Promise.reject(new ApiError(message, status));
  }
);

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { path } = await api.post('/upload', fd);
  return path;
}