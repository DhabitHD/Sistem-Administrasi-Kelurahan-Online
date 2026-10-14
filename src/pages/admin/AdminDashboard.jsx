import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminComplaints, adminLetters, fetchStats, fetchLogs, unwrapList } from '../../services/store.js';
import { getToken } from '../../services/api.js';
import AppIcon from '../../components/common/AppIcon.jsx';

function monthKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

function ExportButton({ kind }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const onClick = async () => {
    setBusy(true);
    setFailed('');
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await fetch(`${base}/admin/export/${kind}`, {
        headers: { Authorization: `Bearer ${getToken() || ''}`, Accept: 'text/csv' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-${kind}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setFailed('Gagal mengunduh. Periksa koneksi / sesi login.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <span className="d-inline-flex flex-column gap-1">
      <button className="btn btn-sm btn-outline-brand" onClick={onClick} disabled={busy}>
        {busy ? 'Mengunduh…' : `CSV ${kind}`}
      </button>
      {failed && <small className="text-danger">{failed}</small>}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [letters, setLetters] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchStats(), adminComplaints(), adminLetters(), fetchLogs({ per_page: 8 }).catch(() => ({ data: [] }))])
      .then(([s, c, l, lg]) => {
        setStats(s);
        setComplaints(unwrapList(c));
        setLetters(unwrapList(l));
        setLogs(unwrapList(lg?.data ?? lg));
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
    ['Menunggu Verifikasi', pending, 'user-check', '/admin/warga', 'stat-grad-brand'],
    ['Pengaduan Terbuka', openComplaints, 'chat-left-text', '/admin/pengaduan', 'stat-grad-brand'],
    ['Surat Terbuka', openLetters, 'file-earmark-text', '/admin/surat', 'stat-grad-brand'],
  ];
  const total = complaints.length + letters.length;
  const trend = useMemo(() => {
    const buckets = {};
    [...complaints, ...letters].forEach((x) => {
      if (!x?.created_at) return;
      const k = monthKey(x.created_at);
      buckets[k] = (buckets[k] || 0) + 1;
    });
    return Object.entries(buckets).sort(([a], [b]) => (a < b ? -1 : 1)).slice(-6);
  }, [complaints, letters]);
  const trendMax = Math.max(1, ...trend.map(([, v]) => v));

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
        <div className="col-lg-6 d-flex flex-column gap-4">
          <div className="dashboard-card p-4 h-auto">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 mb-0"><AppIcon name="bar-chart" className="text-brand me-2" />Tren 6 Bulan</h2>
              <small className="text-muted">pengaduan + surat</small>
            </div>
            {trend.length === 0 ? (
              <p className="text-muted mb-0">Belum ada data tren.</p>
            ) : (
              <div className="d-flex align-items-end gap-2" style={{ height: 120 }} role="img" aria-label="Grafik tren pengaduan dan surat">
                {trend.map(([k, v]) => (
                  <div key={k} className="flex-fill text-center">
                    <div
                      className="rounded mx-auto"
                      style={{ height: `${Math.max(8, (v / trendMax) * 90)}px`, maxWidth: 36, background: 'linear-gradient(135deg, #413E86, #262467)' }}
                      title={`${k}: ${v}`}
                    />
                    <small className="d-block text-muted mt-1" style={{ fontSize: 11 }}>{k.slice(5)}</small>
                    <small className="d-block fw-semibold">{v}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard-card p-4 h-auto">
            <h2 className="h5 mb-3"><AppIcon name="chat-left-text" className="text-brand me-2" />Pengaduan Terbaru</h2>
            {complaints.length === 0 ? <p className="text-muted mb-0">Belum ada pengaduan.</p> : complaints.slice(0, 5).map((c) => (
              <Link to="/admin/pengaduan" state={{ openId: c.id }} className="dash-row text-decoration-none text-reset" key={c.id}>
                <div className="min-w-0">
                  <strong className="d-block text-truncate">{c.title}</strong>
                  <small className="d-block text-muted">{c.id_code} · {c.owner}</small>
                </div>
                <span className="d-flex align-items-center gap-2 text-nowrap">
                  <small>{c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '-'}</small>
                  <AppIcon name="arrow-right" size={15} className="text-brand" />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="col-lg-6 d-flex flex-column gap-4">
          <div className="dashboard-card p-4 h-auto">
            <h2 className="h5 mb-3"><AppIcon name="download" className="text-brand me-2" />Ekspor Laporan</h2>
            <div className="d-flex gap-2 flex-wrap">
              {['pengaduan', 'surat', 'warga'].map((k) => (
                <ExportButton key={k} kind={k} />
              ))}
            </div>
            <small className="text-muted d-block mt-2">Unduhan CSV dengan BOM agar rapi di Excel.</small>
          </div>
          <div className="dashboard-card p-4 h-auto">
            <h2 className="h5 mb-3"><AppIcon name="clock-history" className="text-brand me-2" />Log Aktivitas</h2>
            {logs.length === 0 ? <p className="text-muted mb-0">Belum ada log.</p> : logs.map((g) => (
              <div className="dash-row" key={g.id}>
                <div className="min-w-0">
                  <strong className="d-block small">{g.text}</strong>
                  <small className="d-block text-muted">{g.user?.name || '-'} · {g.created_at ? new Date(g.created_at).toLocaleString('id-ID') : '-'}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-card p-4 h-auto">
            <h2 className="h5 mb-3"><AppIcon name="file-earmark-text" className="text-brand me-2" />Pengajuan Surat Terbaru</h2>
            {letters.length === 0 ? <p className="text-muted mb-0">Belum ada pengajuan surat.</p> : letters.slice(0, 5).map((l) => (
              <Link to="/admin/surat" state={{ openId: l.id }} className="dash-row text-decoration-none text-reset" key={l.id}>
                <div className="min-w-0">
                  <strong className="d-block text-truncate">{l.jenis || l.title}</strong>
                  <small className="d-block text-muted">{l.id_code} · {l.owner}</small>
                </div>
                <span className="d-flex align-items-center gap-2 text-nowrap">
                  <small>{l.created_at ? new Date(l.created_at).toLocaleDateString('id-ID') : '-'}</small>
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