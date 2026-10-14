import { useEffect, useMemo, useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useLayanan, useContentErrors } from '../../services/contentStore.js';
import ServiceCard from '../../components/content/ServiceCard.jsx';
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

export default function LayananList() {
  const layanan = useLayanan();
  const loadErrors = useContentErrors();
  const [qRaw, setQRaw] = useState('');
  const q = useDebounced(qRaw.trim().toLowerCase());
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q]);
  const items = useMemo(
    () => layanan.filter((l) => !q || `${l.name} ${l.short}`.toLowerCase().includes(q)),
    [layanan, q]
  );
  const shown = items.slice(0, visible);
  const failed = loadErrors.includes('layanan');

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
        {failed && (
          <div className="alert alert-warning" role="alert">
            Data layanan gagal dimuat dari server. Menampilkan data terakhir yang tersimpan.
          </div>
        )}
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input
            className="form-control"
            placeholder="Cari layanan…"
            value={qRaw}
            onChange={(e) => setQRaw(e.target.value)}
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
        <>
          <div className="row g-4">
            {shown.map((item) => (
              <div className="col-sm-6 col-lg-3" key={item.slug}>
                <RevealOnScroll className="h-100">
                  <ServiceCard item={item} />
                </RevealOnScroll>
              </div>
            ))}
          </div>
          {visible < items.length && (
            <div className="text-center mt-4">
              <p className="text-muted small">Menampilkan {shown.length} dari {items.length} layanan</p>
              <button className="btn btn-outline-brand" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Muat lebih banyak
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}