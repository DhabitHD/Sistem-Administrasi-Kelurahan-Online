import { useEffect, useState } from 'react';
import { api } from './api.js';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let cache = { berita: null, pengumuman: null, layanan: null, dokumen: null, perangkat: null, video: null, hero: null, profil: null };
let errors = {};
let inflight = null;
const listeners = new Set();

const KINDS = {
  berita: '/berita',
  pengumuman: '/pengumuman',
  layanan: '/layanan',
  dokumen: '/dokumen',
  perangkat: '/perangkat',
  video: '/videos',
  hero: '/hero',
  profil: '/profil',
};

export const fmtDate = (d) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

/**
 * A failed fetch must not be mistaken for "the server has zero records" — that
 * tells residents their kelurahan has no news. Failed kinds keep their previous
 * value and are surfaced through useContentErrors() so the UI can say so.
 */
async function refreshAndNotify() {
  const results = await Promise.all(
    Object.entries(KINDS).map(([kind, url]) =>
      api.get(url).then((value) => [kind, value, null]).catch((e) => [kind, null, e?.message || 'Gagal memuat data'])
    )
  );

  const nextErrors = {};
  const next = { ...cache };
  for (const [kind, value, error] of results) {
    if (error) nextErrors[kind] = error;
    else next[kind] = value;
  }
  cache = next;
  errors = nextErrors;
  /* One throwing subscriber must not silently stop every other mounted hook from
     receiving updates after an admin mutation. */
  for (const fn of listeners) {
    try {
      fn(cache);
    } catch (e) {
      console.error('Subscriber contentStore gagal', e);
    }
  }
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

/**
 * Names of content kinds whose last fetch failed. Drives the "gagal memuat"
 * banner so an empty list is never shown as "there is nothing here".
 */
export function useContentErrors() {
  const [, bump] = useState(0);
  useEffect(() => {
    const update = () => bump((n) => n + 1);
    listeners.add(update);
    return () => listeners.delete(update);
  }, []);
  return Object.keys(errors);
}

/**
 * True once the first fetch for this kind has settled, whatever the outcome.
 * Detail pages need this to tell "still loading" apart from "genuinely absent" —
 * without it a shared /berita/<slug> link renders "Berita tidak ditemukan" and
 * then flips to the article a moment later.
 */
export function useContentLoaded(kind) {
  const [loaded, setLoaded] = useState(cache[kind] !== null);
  useEffect(() => {
    const update = () => setLoaded(cache[kind] !== null);
    listeners.add(update);
    if (cache[kind] === null) loadContent();
    update();
    return () => listeners.delete(update);
  }, [kind]);
  return loaded;
}

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