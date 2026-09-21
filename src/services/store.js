import { useEffect, useState } from 'react';
import { api, uploadFile } from './api.js';

export async function uploadDataUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl || null;
  const blob = await (await fetch(dataUrl)).blob();
  return uploadFile(blob);
}

/* ── Warga ── */
export const listComplaints = () => api.get('/pengaduan');
export const createComplaint = (data) => api.post('/pengaduan', data);
export const listLetters = () => api.get('/surat');
export const createLetter = (data) => api.post('/surat', data);
export const updateProfile = (patch) => api.patch('/warga/profil', patch);
export const listNotifications = () => api.get('/notifikasi');
export const markNotifsSeen = () => api.post('/notifikasi/seen');
export const fetchTracking = (code) => api.get(`/tracking/${encodeURIComponent(code)}`);
export const fetchTugas = (token) => api.get(`/tugas/${encodeURIComponent(token)}`);
export const submitTugasLaporan = (token, data) =>
  api.post(`/tugas/${encodeURIComponent(token)}/laporan`, data);

/* ── Admin ── */
export const listWarga = (filters = {}) =>
  api.get('/admin/warga', { params: filters }).catch((e) => {
    throw e;
  });
export const setWargaStatus = (nik, status, note) =>
  api.patch(`/admin/warga/${encodeURIComponent(nik)}/status`, { status, note: note || undefined });
export const adminComplaints = () => api.get('/admin/pengaduan');
export const adminLetters = () => api.get('/admin/surat');
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
export function useComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listComplaints()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return { items, loading, reload: () => listComplaints().then(setItems) };
}

export function useLetters() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listLetters()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return { items, loading, reload: () => listLetters().then(setItems) };
}

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return { items, loading, reload: () => listNotifications().then(setItems) };
}