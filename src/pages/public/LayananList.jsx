import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useLayanan } from '../../services/contentStore.js';
import ServiceCard from '../../components/content/ServiceCard.jsx';
import RevealOnScroll from '../../components/common/RevealOnScroll.jsx';

export default function LayananList() {
  const layanan = useLayanan();
  const [q, setQ] = useState('');
  const items = layanan.filter(
    (l) => !q || `${l.name} ${l.short}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">LAYANAN</span>
        <h1>Layanan Kelurahan</h1>
        <p className="lead">
          Pilih layanan untuk melihat deskripsi, persyaratan, dan prosesnya.
        </p>
      </div>

      <div className="col-md-5 mb-4 ps-0">
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input
            className="form-control"
            placeholder="Cari layanan…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari layanan"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="service-icon mx-auto"><AppIcon name="search" /></div>
          <h2 className="h5 mt-3">Tidak ada layanan</h2>
          <p className="text-muted mb-0">Tidak ditemukan layanan yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div className="col-sm-6 col-lg-3" key={item.slug}>
              <RevealOnScroll className="h-100">
                <ServiceCard item={item} />
              </RevealOnScroll>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}