import { useEffect } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { markNotifsSeen, useNotifications } from '../../services/store.js';
import AppAlert from '../../components/common/AppAlert.jsx';

export default function Notifikasi() {
  const { refreshUser } = useAuth();
  const { items: notifs, reload, error } = useNotifications();
  const unread = notifs.filter((n) => !n.read_at).length;

  useEffect(() => {
    if (unread > 0) {
      markNotifsSeen()
        .then(() => {
          /* reload() re-fetches; a failure there is not actionable for the resident
             and used to surface as an unhandled promise rejection. */
          reload().catch(() => {});
          refreshUser();
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unread]);

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Notifikasi</h1>
        <p className="lead text-muted">Perkembangan layanan terbaru untuk akun Anda.</p>
      </div>

      {unread > 0 && (
        <div className="alert alert-brand-soft d-flex align-items-center gap-2">
          <AppIcon name="bell-fill" size={18} />
          <span><strong>{unread}</strong> notifikasi baru belum dibaca.</span>
        </div>
      )}

      {error && (
        <AppAlert type="danger">
          Gagal memuat notifikasi dari server ({error}). Coba muat ulang halaman.
        </AppAlert>
      )}

      {!error && (notifs.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <div className="service-icon mx-auto"><AppIcon name="bell" /></div>
          <h2 className="h5 mt-3">Belum ada notifikasi</h2>
          <p className="text-muted mb-0">Notifikasi perkembangan pengaduan dan surat akan muncul di sini.</p>
        </div>
      ) : (
        <div className="dashboard-card p-4">
          {notifs.map((n, i) => (
            <div className="activity" key={n.id} style={{ paddingBottom: i === notifs.length - 1 ? 0 : '.6rem', opacity: n.read_at ? .6 : 1 }}>
              <AppIcon name={n.read_at ? 'check2-circle' : 'bell-fill'} className={n.read_at ? 'text-muted' : 'text-brand'} />
              <div>
                <span>{n.message}</span>
                <small className="text-muted d-block">{new Date(n.created_at).toLocaleString('id-ID')}</small>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}