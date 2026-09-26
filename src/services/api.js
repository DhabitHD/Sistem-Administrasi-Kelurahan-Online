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
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    /* Laravel 422 is the *expected* failure for every form in this app, and it
       returns { message, errors: { field: ["..."] } }. Dropping that map left every
       form able to show nothing but a generic sentence. */
    this.errors = errors || null;
  }

  /** First validation message for a field, if the server sent one. */
  fieldError(field) {
    const v = this.errors?.[field];
    return Array.isArray(v) ? v[0] : v || null;
  }
}

/**
 * The backend used to store uploads as absolute URLs built from APP_URL, e.g.
 * "http://127.0.0.1:8000/storage/uploads/x.jpg". Those rows are still in the
 * database, and rendering one as an <img src> is a cross-origin request that the
 * CSP img-src directive blocks, so every avatar and KTP photo came up blank.
 *
 * Rewriting the origin away at the transport layer repairs existing rows without a
 * SQL migration, and covers every field at once (avatar, ktp, photos, attachments,
 * laporan_fotos) instead of ~12 render sites. The backend now writes relative
 * paths, so this is a no-op for new uploads.
 */
function toSameOrigin(value) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('http')) return value;
  const i = value.indexOf('/storage/');
  return i === -1 ? value : value.slice(i);
}

function normaliseUploads(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = normaliseUploads(node[i]);
    return node;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) node[key] = normaliseUploads(node[key]);
    return node;
  }
  return toSameOrigin(node);
}

api.interceptors.response.use(
  (res) => {
    const payload = res.data && Object.prototype.hasOwnProperty.call(res.data, 'data') ? res.data.data : res.data;
    return normaliseUploads(payload);
  },
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    const message = data?.message || err.message || 'Terjadi kesalahan.';
    // A 401 with no stored token means "wrong password" on /auth/login, not an
    // expired session — tearing down there would sign out every other tab.
    if (status === 401 && getToken()) {
      setToken(null);
      storeUser(null);
      window.dispatchEvent(new Event('betet:logged-out'));
    }
    return Promise.reject(new ApiError(message, status, data?.errors));
  }
);

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { path } = await api.post('/upload', fd, { timeout: 120000 });
  return path;
}