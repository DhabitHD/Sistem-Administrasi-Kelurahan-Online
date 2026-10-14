import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useComplaints, useLetters, useNotifications, trackVisit } from '../../services/store.js';
import AppAlert from '../../components/common/AppAlert.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { items: complaints, error: cErr } = useComplaints();
  const { items: letters, error: lErr } = useLetters();
  const { items: notifications, error: nErr } = useNotifications();
  const error = cErr || lErr || nErr;

  useEffect(() => {
    trackVisit();
  }, []);

  const activities = notifications.slice(0, 5);

  return (
    <div className="container-fluid">
      {/* Welcome header */}
      <div className="mb-4">
        <span className="eyebrow text-brand">DASHBOARD WARGA</span>
        <h1 className="h2 mt-2">Selamat datang, {user.name}</h1>
        <div className="mt-2">
          <StatusBadge status={user.status} />
        </div>
      </div>

      {error && (
        <AppAlert type="danger">
          Sebagian data dashboard gagal dimuat dari server ({error}). Coba muat ulang halaman.
        </AppAlert>
      )}

      {/* Quick action cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="quick-card">
            <div>
              <AppIcon name="file-earmark-text" size={30} />
              <h2 className="h5 mt-2">Ajukan Surat</h2>
              <p className="text-muted mb-0">
                Ajukan surat keterangan kelurahan secara online.
              </p>
            </div>
            <Link to="/warga/surat-baru" className="btn btn-brand mt-3">
              Ajukan Sekarang <AppIcon name="arrow-right" className="ms-1" />
            </Link>
          </div>
        </div>

        <div className="col-md-6">
          <div className="quick-card">
            <div>
              <AppIcon name="chat-left-text" size={30} />
              <h2 className="h5 mt-2">Buat Pengaduan</h2>
              <p className="text-muted mb-0">
                Sampaikan laporan terkait layanan atau lingkungan.
              </p>
            </div>
            <Link to="/warga/pengaduan-baru" className="btn btn-brand mt-3">
              Buat Pengaduan <AppIcon name="arrow-right" className="ms-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-4">
        {/* Complaints summary */}
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="h5">
                <AppIcon name="chat-left-text" className="text-brand me-2" />
                Ringkasan Pengaduan
              </h2>
              <Link to="/warga/pengaduan" className="small text-brand text-decoration-none">Lihat semua</Link>
            </div>
            {complaints.length === 0 ? (
              <p className="text-muted mb-0">Belum ada pengaduan.</p>
            ) : complaints.slice(0, 4).map((item) => (
              <div className="dash-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <small className="d-block text-muted">{item.id_code}</small>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Letters summary */}
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="h5">
                <AppIcon name="file-earmark-text" className="text-brand me-2" />
                Ringkasan Surat
              </h2>
              <Link to="/warga/surat" className="small text-brand text-decoration-none">Lihat semua</Link>
            </div>
            {letters.length === 0 ? (
              <p className="text-muted mb-0">Belum ada pengajuan surat.</p>
            ) : letters.slice(0, 4).map((item) => (
              <div className="dash-row" key={item.id}>
                <div>
                  <strong>{item.title || item.jenis}</strong>
                  <small className="d-block text-muted">{item.id_code}</small>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="col-12">
          <div className="dashboard-card">
            <h2 className="h5">
              <AppIcon name="clock-history" className="text-brand me-2" />
              Aktivitas Terbaru
            </h2>
            {activities.length === 0 ? (
              <p className="text-muted mb-0">Belum ada aktivitas.</p>
            ) : activities.map((a) => (
              <div className="activity" key={a.id}>
                <AppIcon name="check2-circle" className="text-brand" />
                <div>
                  <span>{a.message}</span>
                  <small className="text-muted d-block">{new Date(a.created_at).toLocaleString('id-ID')}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}