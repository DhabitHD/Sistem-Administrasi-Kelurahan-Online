import { useState } from 'react';
import AppIcon from './AppIcon.jsx';
import { loadContent, useContentErrors } from '../../services/contentStore.js';

const labels = {
  berita: 'berita',
  pengumuman: 'pengumuman',
  layanan: 'layanan',
  dokumen: 'dokumen',
  perangkat: 'perangkat',
  video: 'video',
  hero: 'beranda',
  profil: 'profil kelurahan',
};

/**
 * Shown when a content fetch failed. Without it a failed request is indistinguishable
 * from "there is nothing published yet" — residents would conclude their kelurahan
 * has no news at all.
 */
export default function ContentErrorBanner() {
  const failed = useContentErrors();
  const [retrying, setRetrying] = useState(false);

  if (failed.length === 0) return null;

  const retry = async () => {
    setRetrying(true);
    await loadContent();
    setRetrying(false);
  };

  return (
    <div className="container mt-3">
      <div className="alert alert-warning d-flex flex-wrap align-items-center gap-2 mb-0" role="alert">
        <AppIcon name="alert-triangle" className="flex-shrink-0" />
        <div className="flex-grow-1 small">
          Gagal memuat {failed.map((k) => labels[k] || k).join(', ')} dari server. Halaman di bawah
          mungkin belum menampilkan data terbaru.
        </div>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={retry} disabled={retrying}>
          {retrying ? 'Memuat…' : 'Coba lagi'}
        </button>
      </div>
    </div>
  );
}
