import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { Link } from 'react-router-dom';
import { fetchTracking } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { AttachmentList, safeUrl } from '../../services/files.jsx';

export default function Pelacakan() {
  const [term, setTerm] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSearched(false);
    setSearching(true);
    try {
      const res = await fetchTracking(term.trim());
      setResult(res);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Kode tidak ditemukan. Pastikan kode pengaduan (PGD-XXX) atau surat (SK-XXX) benar.');
    } finally {
      setSearched(true);
      setSearching(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">PELACAKAN</span>
        <h1>Cek status layanan Anda</h1>
        <p className="lead">
          Masukkan kode pengaduan (PGD-XXX) atau kode surat (SK-XXX) untuk melihat
          perkembangannya secara real-time.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="side-card">
            <form onSubmit={submit} className="d-flex gap-2 flex-column flex-sm-row">
              <input
                className="form-control form-control-lg"
                placeholder="Kode, contoh: PGD-001 atau SK-015"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                aria-label="Kode pengaduan atau surat"
              />
              <button className="btn btn-brand btn-lg flex-shrink-0" type="submit" disabled={searching}>
                Lacak <AppIcon name="search" className="ms-1" />
              </button>
            </form>
            <small className="text-muted mt-2 d-block">
              Contoh kode demo: <code>PGD-001</code> · <code>SK-015</code> · <code>SK-011</code>
            </small>
          </div>

          {error && searched && (
            <div className="alert alert-danger mt-4" role="alert">
              <AppIcon name="exclamation-circle" className="me-1" />
              {error}
            </div>
          )}

          {result && (
            <div className="side-card mt-4">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <span className="eyebrow text-brand">{result.kind}</span>
                  <h2 className="h4 mt-1">{result.item.title || result.item.jenis}</h2>
                  <p className="text-muted mb-0">
                    Kode <strong>{result.item.id_code}</strong> · diajukan{' '}
                    {new Date(result.item.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <StatusBadge status={result.item.status} />
              </div>
              {result.item.description && (
                <p className="small text-muted mt-3 mb-0">{result.item.description}</p>
              )}
              {result.item.rt != null && (
                <p className="small text-muted mt-1 mb-0">
                  <AppIcon name="geo-alt" className="me-1 text-brand" />RT {String(result.item.rt).padStart(2, '0')} / RW {String(result.item.rw).padStart(2, '0')}
                  {safeUrl(result.item.gmaps_link) && <> · <a href={safeUrl(result.item.gmaps_link)} target="_blank" rel="noreferrer" className="text-brand">Lihat peta</a></>}
                </p>
              )}
              {result.kind === 'Pengaduan' && (result.item.photos?.length || result.item.photo) && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {(result.item.photos?.length ? result.item.photos : [result.item.photo]).map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer">
                      <img src={src} alt={`Foto bukti ${result.item.id_code} ${i + 1}`} className="rounded" style={{ width: 88, height: 66, objectFit: 'cover' }} loading="lazy" />
                    </a>
                  ))}
                </div>
              )}
              <AttachmentList files={result.item.attachments} title="Lampiran" />
              {result.item.laporan && (
                <div className="small mt-3 pt-2 border-top border-light">
                  <strong className="d-block mb-1">Laporan penutupan:</strong>
                  <p className="text-muted mb-1">{result.item.laporan}</p>
                  <AttachmentList files={result.item.laporan_fotos || (result.item.laporan_foto ? [result.item.laporan_foto] : [])} title="Foto penutupan" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className="side-card h-100">
            <div className="doc-icon mb-3"><AppIcon name="shield-check" /></div>
            <h2 className="h5">Layanan pelacakan publik</h2>
            <p className="text-muted">
              Pelacakan dapat digunakan tanpa login. Warga terdaftar juga dapat melihat
              seluruh riwayat pengaduan dan surat pada dashboard.
            </p>
            <Link to="/login" className="btn btn-outline-brand">
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
