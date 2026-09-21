import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { usePengumuman } from '../../services/contentStore.js';
import AnnouncementCard from '../../components/content/AnnouncementCard.jsx';
import RevealOnScroll from '../../components/common/RevealOnScroll.jsx';

export default function PengumumanList() {
  const [q, setQ] = useState('');
  const pengumuman = usePengumuman();
  const items = pengumuman.filter(
    (p) => !q || `${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">INFORMASI</span>
        <h1>Pengumuman</h1>
        <p className="lead">
          Pemberitahuan penting dari Kelurahan Betet.
        </p>
      </div>

      <div className="row">
        <div className="col-lg-9">
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><AppIcon name="search" /></span>
              <input
                className="form-control"
                placeholder="Cari pengumuman…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari pengumuman"
              />
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="service-icon mx-auto"><AppIcon name="search" /></div>
              <h2 className="h5 mt-3">Tidak ada pengumuman</h2>
              <p className="text-muted mb-0">Tidak ditemukan pengumuman yang cocok.</p>
            </div>
          ) : (
            items.map((item) => (
              <RevealOnScroll key={item.slug}>
                <AnnouncementCard item={item} />
              </RevealOnScroll>
            ))
          )}
        </div>
      </div>
    </div>
  );
}