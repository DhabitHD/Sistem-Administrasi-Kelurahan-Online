import { useEffect, useState } from 'react';
import { api } from './api.js';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

let cache = { berita: null, pengumuman: null, layanan: null, dokumen: null, perangkat: null, video: null, hero: null, profil: null };
let errors = {};
let inflight = null;
const inflightKind = {};
const listeners = new Set();
const loadedAt = {};

/** TTL per-kind (ms): konten publik jarang berubah, hemat 8 request sekaligus. */
const KIND_TTL = { berita: 120000, pengumuman: 120000, layanan: 300000, dokumen: 300000, perangkat: 600000, video: 600000, hero: 600000, profil: 600000 };

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
function notify() {
  for (const fn of listeners) {
    try {
      fn(cache);
    } catch (e) {
      console.error('Subscriber contentStore gagal', e);
    }
  }
}

/** Kind yang nilainya harus array. Satu respons rusak tidak boleh meracuni cache. */
const ARRAY_KINDS = new Set(['berita', 'pengumuman', 'layanan', 'dokumen', 'perangkat', 'video', 'hero']);

function checkShape(kind, value) {
  if (ARRAY_KINDS.has(kind)) {
    if (!Array.isArray(value)) throw new Error(`Format data ${kind} tidak valid`);
  } else if (kind === 'profil') {
    if (value !== null && typeof value !== 'object') throw new Error('Format data profil tidak valid');
  }
  return value;
}

/** Muat satu kind saja (hemat vs refresh 8 endpoint). Hormati TTL. */
export async function loadKind(kind, { force = false } = {}) {
  const ttl = KIND_TTL[kind] ?? 120000;
  if (!force && cache[kind] !== null && Date.now() - (loadedAt[kind] || 0) < ttl) return cache[kind];
  if (inflightKind[kind]) return inflightKind[kind];
  inflightKind[kind] = api
    .get(KINDS[kind])
    .then((value) => {
      checkShape(kind, value);
      cache = { ...cache, [kind]: value };
      loadedAt[kind] = Date.now();
      const nextErrors = { ...errors };
      delete nextErrors[kind];
      errors = nextErrors;
      notify();
      return value;
    })
    .catch((e) => {
      errors = { ...errors, [kind]: e?.message || 'Gagal memuat data' };
      notify();
      throw e;
    })
    .finally(() => {
      delete inflightKind[kind];
    });
  return inflightKind[kind];
}

export async function loadContent() {
  if (inflight) return inflight;
  // Kompatibilitas: muat semua kind secara lazy-paralel (satu per kind).
  inflight = Promise.allSettled(Object.keys(KINDS).map((k) => loadKind(k)))
    .catch((e) => console.error('Gagal memuat konten', e))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function useContent(kind) {
  const [items, setItems] = useState(cache[kind] || []);

  useEffect(() => {
    const update = (c) => {
      const v = c[kind];
      setItems(Array.isArray(v) ? v : []);
    };
    listeners.add(update);
    if (cache[kind] === null) loadKind(kind).then(() => setItems(cache[kind] || [])).catch(() => {});
    return () => listeners.delete(update);
  }, [kind]);

  return Array.isArray(items) ? items : [];
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
    if (cache[kind] === null) loadKind(kind).catch(() => {});
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
    const update = (c) => setProfil(c.profil && typeof c.profil === 'object' ? c.profil : null);
    listeners.add(update);
    if (cache.profil === null) loadKind('profil').then(() => setProfil(cache.profil)).catch(() => {});
    return () => listeners.delete(update);
  }, []);
  return profil && typeof profil === 'object' ? profil : null;
}

async function mutate(kind, fn) {
  const item = await fn();
  await loadKind(kind, { force: true });
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