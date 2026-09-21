import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useBerita } from '../../services/contentStore.js';
import NewsCard from '../../components/content/NewsCard.jsx';
import RevealOnScroll from '../../components/common/RevealOnScroll.jsx';

export default function BeritaList() {
  const berita = useBerita();
  const categories = ['Semua', ...new Set(berita.map((b) => b.category))];
  const [cat, setCat] = useState('Semua');
  const [q, setQ] = useState('');

  const items = berita.filter(
    (b) =>
      (cat === 'Semua' || b.category === cat) &&
      (!q || `${b.title} ${b.summary} ${b.category}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">INFORMASI</span>
        <h1>Berita Kelurahan</h1>
        <p className="lead">
          Kabar kegiatan, pelayanan, dan perkembangan Kelurahan Betet.
        </p>
      </div>

      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white"><AppIcon name="search" /></span>
            <input
              className="form-control"
              placeholder="Cari berita…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari berita"
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="d-flex gap-2 flex-wrap justify-content-md-end">
            {categories.map((c) => (
              <button
                key={c}
                className={`btn btn-sm ${cat === c ? 'btn-brand' : 'btn-outline-brand'}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="service-icon mx-auto"><AppIcon name="search" /></div>
          <h2 className="h5 mt-3">Tidak ada berita</h2>
          <p className="text-muted mb-0">
            Tidak ditemukan berita yang cocok dengan pencarian.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.slug}>
              <RevealOnScroll className="h-100">
                <NewsCard item={item} />
              </RevealOnScroll>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}