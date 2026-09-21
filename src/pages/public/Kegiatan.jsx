import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useBerita } from '../../services/contentStore.js';
import NewsCard from '../../components/content/NewsCard.jsx';

export default function Kegiatan() {
  const [q, setQ] = useState('');
  const all = useBerita().filter((x) => ['Kegiatan', 'Lingkungan', 'Pemberdayaan', 'Pembangunan'].includes(x.category));
  const items = all.filter(
    (x) => !q || `${x.title} ${x.summary} ${x.category}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">KEGIATAN</span>
        <h1 className="mt-3">Kegiatan Kelurahan Betet</h1>
        <p className="lead">Berita kegiatan, pemberdayaan masyarakat, lingkungan, dan program kelurahan.</p>
      </div>

      <div className="col-md-5 mb-4 ps-0">
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input
            className="form-control"
            placeholder="Cari kegiatan…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari kegiatan"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="service-icon mx-auto"><AppIcon name="search" /></div>
          <h2 className="h5 mt-3">Tidak ada kegiatan</h2>
          <p className="text-muted mb-0">Tidak ditemukan kegiatan yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => <div className="col-md-6 col-lg-4" key={item.slug}><NewsCard item={item} /></div>)}
        </div>
      )}
    </div>
  );
}