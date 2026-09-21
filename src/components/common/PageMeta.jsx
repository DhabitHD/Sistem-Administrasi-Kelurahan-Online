import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBerita, getPengumuman, getLayanan } from '../../services/contentStore.js';

const base = 'Kelurahan Betet — Kota Kediri';

const pageNames = {
  berita: 'Berita',
  pengumuman: 'Pengumuman',
  kegiatan: 'Kegiatan',
  dokumen: 'Dokumen Publik',
  layanan: 'Layanan',
  pengaduan: 'Pengaduan',
  pelacakan: 'Pelacakan',
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

function resolve(pathname) {
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
      getBerita().find((x) => x.slug === b) ||
      getPengumuman().find((x) => x.slug === b) ||
      getLayanan().find((x) => x.slug === b);
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
  const { pathname } = useLocation();
  const { title, desc } = resolve(pathname);

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

    setMeta('meta[name="description"]', 'description', desc);
    const img = `${window.location.origin}/assets/placeholders/logo-kelurahan.png`;
    setMeta('meta[property="og:image"]', 'og:image', img);
    setMeta('meta[name="twitter:image"]', 'twitter:image', img, 'name');
  }, [title, desc]);

  return null;
}