import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';
import { fetchTugas, submitTugasLaporan, uploadDataUrl } from '../../services/store.js';
import MultiFileUpload from '../../components/warga/MultiFileUpload.jsx';
import { AttachmentList } from '../../services/files.jsx';

const fmt = (n) => String(n ?? 0).padStart(2, '0');

export default function TugasLaporan() {
  const { token } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [laporan, setLaporan] = useState('');
  const [fotos, setFotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchTugas(token)
      .then(setItem)
      .catch((e) => setError(e.message || 'Tautan tidak valid.'))
      .finally(() => setLoading(false));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!laporan.trim()) {
      setError('Isi laporan hasil penanganan terlebih dahulu.');
      return;
    }
    setSaving(true);
    try {
      const laporan_fotos = await Promise.all(fotos.map((f) => uploadDataUrl(f.dataUrl)));
      const res = await submitTugasLaporan(token, { laporan: laporan.trim(), laporan_fotos: laporan_fotos.length ? laporan_fotos : null });
      setItem(res);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Gagal mengirim laporan.');
    } finally {
      setSaving(false);
    }
  };

  const isOpen = item && !['CLOSED', 'DITOLAK'].includes(item.status);

  return (
    <div className="container py-5">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">TUGAS LAPANGAN</span>
        <h1>Laporan Penanganan Pengaduan</h1>
        <p className="lead">
          Isi laporan hasil penanganan untuk menutup pengaduan yang ditugaskan kepada Anda.
        </p>
      </div>

      {loading && <p className="text-muted">Memuat data…</p>}

      {error && !item && (
        <div className="side-card">
          <AppAlert type="danger">{error}</AppAlert>
          <Link to="/" className="btn btn-outline-brand">Kembali ke Beranda</Link>
        </div>
      )}

      {item && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="dashboard-card p-4">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <small className="text-muted">{item.id_code} · {new Date(item.created_at).toLocaleDateString('id-ID')}</small>
                  <h2 className="h4 mt-1 mb-1">{item.title}</h2>
                  <span className="text-brand small fw-semibold">{item.category}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-muted small mt-3 mb-1">{item.description}</p>
              <p className="small mb-0"><AppIcon name="geo-alt" className="me-1 text-brand" />RT {fmt(item.rt)} / RW {fmt(item.rw)}</p>
              {item.gmaps_link && <p className="small mb-0"><AppIcon name="map-pin" className="me-1 text-brand" /><a href={item.gmaps_link} target="_blank" rel="noreferrer" className="text-brand">Lihat peta</a></p>}
              {(item.photos?.length || item.photo) && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {(item.photos?.length ? item.photos : [item.photo]).map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer">
                      <img src={src} alt={`Foto bukti ${item.id_code} ${i + 1}`} className="rounded" style={{ width: 88, height: 66, objectFit: 'cover' }} loading="lazy" />
                    </a>
                  ))}
                </div>
              )}
              {item.petugas && (
                <p className="small text-muted mb-0 mt-3">
                  <AppIcon name="user-cog" className="me-1 text-brand" />Petugas: <strong>{item.petugas.nama}</strong>
                </p>
              )}
            </div>

            {done && (
              <div className="side-card mt-4">
                <div className="doc-icon mb-3"><AppIcon name="circle-check" /></div>
                <h2 className="h5">Laporan terkirim</h2>
                <p className="text-muted mb-0">Terima kasih. Pengaduan {item.id_code} telah ditutup dan warga telah diberi tahu.</p>
                <Link to="/" className="btn btn-brand mt-3">Kembali ke Beranda</Link>
              </div>
            )}

            {!done && item.status === 'DITOLAK' && (
              <div className="side-card mt-4">
                <AppAlert type="danger">Pengaduan ini ditolak, tidak dapat diisi laporan.</AppAlert>
              </div>
            )}

            {!done && isOpen && (
              <div className="dashboard-card p-4 mt-4">
                <h2 className="h5 mb-1">Laporan Hasil Penanganan</h2>
                <p className="small text-muted mb-3">Pengaduan akan otomatis ditutup setelah laporan dikirim.</p>
                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="laporan">Uraian laporan</label>
                    <textarea id="laporan" rows="4" className="form-control" placeholder="Jelaskan tindakan yang telah dilakukan…" value={laporan} onChange={(e) => setLaporan(e.target.value)}></textarea>
                  </div>
                  <div className="mb-3">
                    <MultiFileUpload
                      id="laporan-fotos"
                      label="Foto bukti penanganan (opsional, maks 3)"
                      accept="image/*"
                      imagesOnly
                      maxSize={500 * 1024}
                      maxFiles={3}
                      value={fotos}
                      onChange={setFotos}
                      onError={setError}
                    />
                  </div>
                  {error && <AppAlert type="danger">{error}</AppAlert>}
                  <button className="btn btn-brand" type="submit" disabled={saving}>
                    {saving ? 'Mengirim…' : 'Kirim & Tutup Pengaduan'}
                    <AppIcon name="send" className="ms-1" />
                  </button>
                </form>
              </div>
            )}

            {!done && !isOpen && item.status === 'CLOSED' && (
              <div className="dashboard-card p-4 mt-4">
                <h2 className="h5 mb-3">Laporan Penutupan</h2>
                <p className="text-muted small mb-0">{item.laporan || 'Tanpa uraian.'}</p>
                <AttachmentList files={item.laporan_fotos || (item.laporan_foto ? [item.laporan_foto] : [])} title="Foto penutupan" />
              </div>
            )}
          </div>

          <div className="col-lg-5">
            <div className="side-card">
              <div className="doc-icon mb-3"><AppIcon name="shield-check" /></div>
              <h2 className="h5">Tautan rahasia</h2>
              <p className="text-muted small mb-0">
                Halaman ini hanya untuk petugas yang menerima link dari WhatsApp. Jangan bagikan tautan ini —
                siapa pun yang memegangnya dapat mengisi laporan dan menutup pengaduan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
