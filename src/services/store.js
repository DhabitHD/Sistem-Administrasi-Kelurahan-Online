import { useEffect, useState } from 'react';
import { api, uploadFile } from './api.js';

export async function uploadDataUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl || null;
  const blob = await (await fetch(dataUrl)).blob();
  return uploadFile(blob);
}

/* ── Warga ── */
// Backend mengembalikan array polos (default) atau {data,meta} bila ?page dipakai.
// unwrapList menyeragamkan keduanya agar hooks lama tidak pecah.
export const unwrapList = (res) => (Array.isArray(res) ? res : (res?.data ?? []));
export const unwrapMeta = (res) => (Array.isArray(res) ? null : (res?.meta ?? null));

export const listComplaints = async (params) => unwrapList(await api.get('/pengaduan', { params }));
export const createComplaint = (data) => api.post('/pengaduan', data);
export const updateComplaint = (id, data) => api.put(`/pengaduan/${id}`, data);
export const cancelComplaint = (id) => api.post(`/pengaduan/${id}/batal`);
export const listLetters = async (params) => unwrapList(await api.get('/surat', { params }));
export const createLetter = (data) => api.post('/surat', data);
export const updateLetter = (id, data) => api.put(`/surat/${id}`, data);
export const cancelLetter = (id) => api.post(`/surat/${id}/batal`);
export const updateProfile = (patch) => api.patch('/warga/profil', patch);
export const changePassword = (payload) => api.patch('/warga/password', payload);
export const forgotPassword = (email) => api.post('/auth/forgot', { email });
export const resetPassword = (payload) => api.post('/auth/reset', payload);
export const listNotifications = () => api.get('/notifikasi');
export const markNotifsSeen = () => api.post('/notifikasi/seen');
export const fetchTracking = (code) => api.get(`/tracking/${encodeURIComponent(code)}`);
export const fetchTugas = (token) => api.get(`/tugas/${encodeURIComponent(token)}`);
export const submitTugasLaporan = (token, data) =>
  api.post(`/tugas/${encodeURIComponent(token)}/laporan`, data);

/* ── Admin ── */
export const listWarga = async (filters = {}) => unwrapList(await api.get('/admin/warga', { params: filters }));
export const setWargaStatus = (nik, status, note) =>
  api.patch(`/admin/warga/${encodeURIComponent(nik)}/status`, { status, note: note || undefined });
export const deleteWarga = (nik) => api.delete(`/admin/warga/${encodeURIComponent(nik)}`);
export const adminComplaints = async (params) => unwrapList(await api.get('/admin/pengaduan', { params }));
export const adminLetters = async (params) => unwrapList(await api.get('/admin/surat', { params }));
export const fetchLogs = (params) => api.get('/admin/logs', { params });
export const exportUrl = (kind) => `/api/admin/export/${kind}`;
export const setItemStatus = (kind, id, status) =>
  api.patch(`/admin/${kind}/${id}/status`, { status });
export const listOfficers = () => api.get('/admin/officers');
export const createOfficer = (data) => api.post('/admin/officers', data);
export const updateOfficer = (id, data) => api.put(`/admin/officers/${id}`, data);
export const deleteOfficer = (id) => api.delete(`/admin/officers/${id}`);
export const assignOfficer = (id, officerId) =>
  api.patch(`/admin/pengaduan/${id}/petugas`, { officer_id: officerId });
export const closeComplaint = (id, data) => api.post(`/admin/pengaduan/${id}/tutup`, data);
export const fetchStats = () => api.get('/admin/stats');
export const listAdmins = () => api.get('/admin/admins');
export const createAdmin = (data) => api.post('/admin/admins', data);
export const updateAdmin = (id, data) => api.put(`/admin/admins/${id}`, data);
export const deleteAdmin = (id) => api.delete(`/admin/admins/${id}`);
export const trackVisit = () => api.post('/visits').catch(() => null);

/* ── Hooks ── */
/* A failed fetch must not render as an empty list: residents would think their
   complaints or letters vanished. `error` is surfaced so pages can say so. */
function useList(fetcher) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetcher()
      .then((data) => {
        if (!alive) return;
        setItems(unwrapList(data));
        setError(null);
      })
      .catch((e) => {
        if (alive) setError(e?.message || 'Gagal memuat data');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setItems(unwrapList(data));
    } catch (e) {
      setError(e?.message || 'Gagal memuat ulang');
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { items, loading, error, reload };
}

export const useComplaints = () => useList(listComplaints);
export const useLetters = () => useList(listLetters);
export const useNotifications = () => useList(listNotifications);