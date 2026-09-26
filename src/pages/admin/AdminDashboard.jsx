import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminComplaints, adminLetters, fetchStats } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchStats(), adminComplaints(), adminLetters()])
      .then(([s, c, l]) => {
        setStats(s);
        setComplaints(c);
        setLetters(l);
        setError('');
      })
      /* A silent catch here rendered 0/0/0/0 with no explanation, which reads as
         "the kelurahan has no residents and no cases" rather than "the API is
         unreachable". */
      .catch((e) => setError(`Ringkasan gagal dimuat: ${e?.message || 'periksa koneksi ke server'}`));
  }, []);

  const warga = stats?.warga_total ?? null;
  const pending = stats?.warga_pending ?? null;
  const openComplaints = stats?.pengaduan_aktif ?? null;
  const openLetters = stats?.surat_aktif ?? null;

  const statCards = [
    ['Warga Terdaftar', warga, 'people', '/admin/warga', 'stat-grad-brand'],
    ['Menunggu Verifikasi', pending, 'user-check', '/admin/warga', 'stat-grad-blue'],
    ['Pengaduan Terbuka', openComplaints, 'chat-left-text', '/admin/pengaduan', 'stat-grad-sky'],
    ['Surat Terbuka', openLetters, 'file-earmark-text', '/admin/surat', 'stat-grad-indigo'],
  ];
  const total = complaints.length + letters.length;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Dashboard Admin</h1>
        <p className="lead text-muted">
          Ringkasan layanan Kelurahan Betet. {total} total pengaduan &amp; surat.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <AppIcon name="exclamation-circle" size={18} />
          <span>{error} Angka di bawah tidak dapat dipercaya.</span>
        </div>
      )}

      <div className="row g-4 mb-4">
        {statCards.map(([label, value, icon, to, grad]) => (
          <div className="col-sm-6 col-lg-3" key={label}>
            <Link to={to} className={`stat-card ${grad} p-4 d-block text-decoration-none h-100`}>
              <span className="stat-icon"><AppIcon name={icon} size={20} /></span>
              <div className="stat-card__val mb-0">{value ?? '—'}</div>
              <span className="stat-card__label">{label}</span>
            </Link>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AppIcon name="alert-circle" size={18} />
          <span className="flex-grow-1">Ada <strong>{pending} pendaftar</strong> menunggu verifikasi.</span>
          <Link to="/admin/warga" className="btn btn-sm btn-brand">Verifikasi Sekarang</Link>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3"><AppIcon name="chat-left-text" className="text-brand me-2" />Pengaduan Terbaru</h2>
            {complaints.length === 0 ? <p className="text-muted mb-0">Belum ada pengaduan.</p> : complaints.slice(0, 5).map((c) => (
              <Link to="/admin/pengaduan" state={{ openId: c.id }} className="dash-row text-decoration-none text-reset" key={c.id}>
                <div className="min-w-0">
                  <strong className="d-block text-truncate">{c.title}</strong>
                  <small className="d-block text-muted">{c.id_code} · {c.owner}</small>
                </div>
                <span className="d-flex align-items-center gap-2 text-nowrap">
                  <small>{new Date(c.created_at).toLocaleDateString('id-ID')}</small>
                  <AppIcon name="arrow-right" size={15} className="text-brand" />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3"><AppIcon name="file-earmark-text" className="text-brand me-2" />Pengajuan Surat Terbaru</h2>
            {letters.length === 0 ? <p className="text-muted mb-0">Belum ada pengajuan surat.</p> : letters.slice(0, 5).map((l) => (
              <Link to="/admin/surat" state={{ openId: l.id }} className="dash-row text-decoration-none text-reset" key={l.id}>
                <div className="min-w-0">
                  <strong className="d-block text-truncate">{l.jenis || l.title}</strong>
                  <small className="d-block text-muted">{l.id_code} · {l.owner}</small>
                </div>
                <span className="d-flex align-items-center gap-2 text-nowrap">
                  <small>{new Date(l.created_at).toLocaleDateString('id-ID')}</small>
                  <AppIcon name="arrow-right" size={15} className="text-brand" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}