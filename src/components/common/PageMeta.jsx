import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBerita, usePengumuman, useLayanan, useContentLoaded } from '../../services/contentStore.js';

const base = 'Kelurahan Betet — Kota Kediri';

/* Private areas and the officer magic-link route must stay out of search results.
   /tugas/:token is a secret 40-char token in the path. */
const NOINDEX = ['warga', 'admin', 'tugas', 'login', 'register', 'verifikasi', 'cari', 'pelacakan'];
const SHARE_IMAGE = '/assets/placeholders/logo-kelurahan.png';

const pageNames = {
  berita: 'Berita',
  pengumuman: 'Pengumuman',
  kegiatan: 'Kegiatan',
  dokumen: 'Dokumen Publik',
  layanan: 'Layanan',
  pengaduan: 'Pengaduan',
  pelacakan: 'Pelacakan',
  tugas: 'Tugas Lapangan',
  kontak: 'Kontak',
  pemerintahan: 'Pemerintahan',
  cari: 'Cari',
  profil: 'Profil Kelurahan',
  login: 'Masuk',
  register: 'Daftar',
  verifikasi: 'Verifikasi',
  warga: 'Portal Warga',
  admin: 'Panel Admin',
};

const profilSubNames = {
  sejarah: 'Sejarah',
  'visi-misi': 'Visi & Misi',
  'struktur-organisasi': 'Struktur Organisasi',
  demografi: 'Demografi',
};

function resolve(pathname, berita, pengumuman, layanan) {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) {
    return { title: `Beranda — ${base}`, desc: 'Website resmi Kelurahan Betet, Kecamatan Pesantren, Kota Kediri. Portal informasi dan pelayanan publik.' };
  }
  const [a, b] = segs;

  if (a === 'warga') {
    return { title: `Portal Warga — ${base}`, desc: 'Portal warga Kelurahan Betet: pengaduan, layanan surat, dan riwayat layanan.' };
  }
  if (a === 'admin') {
    return { title: `Panel Admin — ${base}`, desc: 'Panel admin Kelurahan Betet: verifikasi warga, pengaduan, surat, dan konten.' };
  }
  if (a === 'profil' && b) {
    const sub = profilSubNames[b];
    if (sub) return { title: `${sub} Kelurahan — ${base}`, desc: `Profil ${sub} Kelurahan Betet, Kota Kediri.` };
  }

  const page = pageNames[a];
  if (b) {
    const item =
      berita.find((x) => x.slug === b) ||
      pengumuman.find((x) => x.slug === b) ||
      layanan.find((x) => x.slug === b);
    if (item) {
      const name = item.title || item.name;
      const desc = item.summary || item.short || '';
      return { title: `${name} — ${page || base}`, desc: desc.slice(0, 155) };
    }
  }
  if (page) {
    return { title: `${page} — ${base}`, desc: `${page} Kelurahan Betet, Kota Kediri.` };
  }
  return { title: `Halaman tidak ditemukan — ${base}`, desc: 'Halaman yang dicari tidak tersedia.' };
}

export default function PageMeta() {
  const { pathname, search } = useLocation();
  /* Subscribing to the store (rather than reading a non-reactive getter) is what
     makes a direct hit on /berita/<slug> resolve to the real article title once
     the content lands. Without it the tab title stayed "Halaman tidak ditemukan"
     for the whole visit. */
  const berita = useBerita();
  const pengumuman = usePengumuman();
  const layanan = useLayanan();
  useContentLoaded('berita');
  useContentLoaded('pengumuman');
  useContentLoaded('layanan');

  const { title, desc } = resolve(pathname, berita, pengumuman, layanan);
  const segs = pathname.split('/').filter(Boolean);
  const seg = segs[0];
  /* A path with no matching page is the 404 route. It must not be indexed, and it
     must not canonicalise to itself or the bogus URL becomes a thin indexable page. */
  const isNotFound = segs.length > 0 && !pageNames[seg] && !(seg === 'profil' && segs[1] && profilSubNames[segs[1]]);
  const noindex = NOINDEX.includes(seg) || isNotFound;

  useEffect(() => {
    document.title = title;

    const setMeta = (selector, attrName, value, kind = 'auto') => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        const attr = kind === 'name' || (kind === 'auto' && !attrName.includes(':')) ? 'name' : 'property';
        meta.setAttribute(attr, attrName);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    /* Strip the query string so /cari?q=… and /pelacak?code=… do not compete
       with their canonical page. */
    const url = `${window.location.origin}${pathname}`;
    const img = `${window.location.origin}${SHARE_IMAGE}`;

    setMeta('meta[name="description"]', 'description', desc);
    setMeta('meta[property="og:title"]', 'og:title', title);
    setMeta('meta[property="og:description"]', 'og:description', desc);
    setMeta('meta[property="og:url"]', 'og:url', url);
    setMeta('meta[property="og:image"]', 'og:image', img);
    setMeta('meta[name="twitter:title"]', 'twitter:title', title, 'name');
    setMeta('meta[name="twitter:description"]', 'twitter:description', desc, 'name');
    setMeta('meta[name="twitter:image"]', 'twitter:image', img, 'name');
    setMeta('meta[name="robots"]', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    /* On a 404, drop the canonical entirely. Pointing it at the bogus URL tells
       search engines the non-existent page is the authoritative version of itself. */
    if (isNotFound) canonical.remove();
    else canonical.setAttribute('href', url);
  }, [title, desc, pathname, search, noindex, isNotFound]);

  return null;
}