import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useDokumen, useContentErrors } from '../../services/contentStore.js';
import { safeFileUrl } from '../../services/files.jsx';

const PAGE_SIZE = 6;

function useDebounced(value, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function Dokumen() {
  const all = useDokumen();
  const loadErrors = useContentErrors();
  const [qRaw, setQRaw] = useState('');
  const [cat, setCat] = useState('Semua');
  const q = useDebounced(qRaw.trim().toLowerCase());
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, cat]);
  const categories = useMemo(() => ['Semua', ...new Set(all.map((d) => d.category).filter(Boolean))], [all]);
  const items = useMemo(
    () =>
      all.filter(
        (d) =>
          (cat === 'Semua' || d.category === cat) &&
          (!q || `${d.title} ${d.desc} ${d.category || ''}`.toLowerCase().includes(q))
      ),
    [all, cat, q]
  );
  const shown = items.slice(0, visible);
  const failed = loadErrors.includes('dokumen');

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">DOKUMEN PUBLIK</span>
        <h1 className="mt-3">Dokumen dan informasi publik</h1>
        <p className="lead">Koleksi dokumen publik Kelurahan Betet dapat diunduh langsung tanpa login.</p>
      </div>
      {failed && (
        <div className="alert alert-warning" role="alert">
          Data dokumen gagal dimuat dari server. Menampilkan data terakhir yang tersimpan.
        </div>
      )}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white"><AppIcon name="search" /></span>
            <input className="form-control" placeholder="Cari dokumen…" value={qRaw} onChange={(e) => setQRaw(e.target.value)} aria-label="Cari dokumen" />
          </div>
        </div>
        <div className="col-md-7">
          <div className="d-flex gap-2 flex-wrap justify-content-md-end">
            {categories.map((c) => (
              <button key={c} className={`btn btn-sm ${cat === c ? 'btn-brand' : 'btn-outline-brand'}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state py-5">
          <p className="text-muted mb-0">Belum ada dokumen atau informasi publik.</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {shown.map((doc) => (
            <div className="col-md-6" key={doc.slug}>
              <div className="doc-card h-100">
                <div className="doc-icon"><AppIcon name={doc.icon || 'file-earmark-text'} size={20} /></div>
                <div className="flex-grow-1">
                  <h2 className="h5 mb-1">{doc.title}</h2>
                  <p className="small text-muted mb-3">{doc.desc}</p>
                  {Array.isArray(doc.content) && doc.content.length > 0 && (
                    <div className="small mb-3">
                      {doc.content.map((p, i) => <p key={i} className="mb-2">{p}</p>)}
                    </div>
                  )}
                  {safeFileUrl(doc.file) ? (
                    /* No target="_blank" here: it defeats the download attribute for
                       cross-origin files, so the button labelled "Unduh" just opened
                       a tab. Same-origin files download; anything else still opens
                       the document, which is the useful fallback. */
                    <a href={safeFileUrl(doc.file)} download rel="noreferrer" className="btn btn-sm btn-brand">
                      <AppIcon name="download" className="me-1" /> Unduh Dokumen
                    </a>
                  ) : (
                    <span className="small text-muted">
                      <AppIcon name="clock" className="me-1" /> Berkas belum tersedia untuk diunduh
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
          {visible < items.length && (
            <div className="text-center mt-4">
              <p className="text-muted small">Menampilkan {shown.length} dari {items.length} dokumen</p>
              <button className="btn btn-outline-brand" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Muat lebih banyak
              </button>
            </div>
          )}
        </>
      )}
      <div className="mt-5"><Link to="/profil" className="btn btn-brand">Kembali ke Profil</Link></div>
    </div>
  );
}