import { useEffect, useMemo, useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { usePengumuman, useContentErrors } from '../../services/contentStore.js';
import AnnouncementCard from '../../components/content/AnnouncementCard.jsx';
import RevealOnScroll from '../../components/common/RevealOnScroll.jsx';

const PAGE_SIZE = 8;

function useDebounced(value, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function PengumumanList() {
  const [qRaw, setQRaw] = useState('');
  const q = useDebounced(qRaw.trim().toLowerCase());
  const pengumuman = usePengumuman();
  const loadErrors = useContentErrors();
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q]);
  const items = useMemo(
    () => pengumuman.filter((p) => !q || `${p.title} ${p.summary}`.toLowerCase().includes(q)),
    [pengumuman, q]
  );
  const shown = items.slice(0, visible);
  const failed = loadErrors.includes('pengumuman');

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
          <div className="panel-card">
            {failed && (
              <div className="alert alert-warning" role="alert">
                Data pengumuman gagal dimuat dari server. Menampilkan data terakhir yang tersimpan.
              </div>
            )}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-white"><AppIcon name="search" /></span>
                <input
                  className="form-control"
                  placeholder="Cari pengumuman…"
                  value={qRaw}
                  onChange={(e) => setQRaw(e.target.value)}
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
              <>
                {shown.map((item) => (
                  <RevealOnScroll key={item.slug}>
                    <AnnouncementCard item={item} />
                  </RevealOnScroll>
                ))}
                {visible < items.length && (
                  <div className="text-center mt-4">
                    <p className="text-muted small">Menampilkan {shown.length} dari {items.length} pengumuman</p>
                    <button className="btn btn-outline-brand" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Muat lebih banyak
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}