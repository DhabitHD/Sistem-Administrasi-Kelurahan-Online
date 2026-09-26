import { useEffect, useState } from 'react';
import { api } from './api.js';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let cache = { berita: null, pengumuman: null, layanan: null, dokumen: null, perangkat: null, video: null, hero: null, profil: null };
let inflight = null;
const listeners = new Set();

export const fmtDate = (d) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

async function refreshAndNotify() {
  const [berita, pengumuman, layanan, dokumen, perangkat, video, hero, profil] = await Promise.all([
    api.get('/berita').catch(() => null),
    api.get('/pengumuman').catch(() => null),
    api.get('/layanan').catch(() => null),
    api.get('/dokumen').catch(() => null),
    api.get('/perangkat').catch(() => null),
    api.get('/videos').catch(() => null),
    api.get('/hero').catch(() => null),
    api.get('/profil').catch(() => null),
  ]);
  cache = { berita, pengumuman, layanan, dokumen, perangkat, video, hero, profil };
  listeners.forEach((fn) => fn(cache));
}

export async function loadContent() {
  if (inflight) return inflight;
  inflight = refreshAndNotify()
    .catch((e) => console.error('Gagal memuat konten', e))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function useContent(kind) {
  const [items, setItems] = useState(cache[kind] || []);

  useEffect(() => {
    const update = (c) => setItems(c[kind] || []);
    listeners.add(update);
    if (cache[kind] === null) loadContent().then(() => setItems(cache[kind] || []));
    return () => listeners.delete(update);
  }, [kind]);

  return items;
}

/* keep sync getters for components that must read non-reactively (remove once migrated) */
export const getBerita = () => cache.berita || [];
export const getPengumuman = () => cache.pengumuman || [];
export const getLayanan = () => cache.layanan || [];

export const useBerita = () => useContent('berita');
export const usePengumuman = () => useContent('pengumuman');
export const useLayanan = () => useContent('layanan');
export const useDokumen = () => useContent('dokumen');
export const usePerangkat = () => useContent('perangkat');
export const useVideo = () => useContent('video');
export const useHeroSlides = () => useContent('hero');

export function useProfil() {
  const [profil, setProfil] = useState(cache.profil);
  useEffect(() => {
    const update = (c) => setProfil(c.profil);
    listeners.add(update);
    if (cache.profil === null) loadContent().then(() => setProfil(cache.profil));
    return () => listeners.delete(update);
  }, []);
  return profil;
}

async function mutate(kind, fn) {
  const item = await fn();
  await refreshAndNotify();
  return item;
}

export const addItem = (kind, data) =>
  mutate(kind, () => api.post(`/admin/${kind}`, data));
export const updateItem = (kind, slug, data) =>
  mutate(kind, () => api.put(`/admin/${kind}/${slug}`, data));
export const deleteItem = (kind, slug) =>
  mutate(kind, () => api.delete(`/admin/${kind}/${slug}`));

export const addSlide = (data) => mutate('hero', () => api.post('/admin/hero', data));
export const updateSlide = (id, data) => mutate('hero', () => api.put(`/admin/hero/${id}`, data));
export const deleteSlide = (id) => mutate('hero', () => api.delete(`/admin/hero/${id}`));

export const updateProfil = (data) => mutate('profil', () => api.put('/admin/profil/1', data));