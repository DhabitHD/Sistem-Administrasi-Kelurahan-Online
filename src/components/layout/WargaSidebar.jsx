import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AppIcon from '../common/AppIcon.jsx';

const links = [
  ['/warga', 'Dashboard', 'grid-1x2', true],
  ['/warga/pengaduan', 'Pengaduan', 'chat-left-text', false],
  ['/warga/surat', 'Layanan Surat', 'file-earmark-text', false],
  ['/warga/riwayat', 'Riwayat / Tracking', 'clock-history', false],
  ['/warga/notifikasi', 'Notifikasi', 'bell', false],
  ['/warga/profil', 'Profil', 'person', false],
];

export default function WargaSidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const unread = user?.notif_unread || 0;

  return (
    <aside className="warga-sidebar">
      {/* Brand */}
      <div className="p-4 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <img
            src="/assets/placeholders/logo-kelurahan.png"
            className="brand-logo"
            alt="Logo"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
          />
          <div>
            <strong>Kelurahan Betet</strong>
            <small className="d-block text-muted">Panel Warga</small>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3">
        {links.map(([to, label, icon]) => (
          <NavLink className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} end={to === '/warga'} key={to} to={to}>
            <AppIcon name={icon} size={17} />
            {label}
            {to === '/warga/notifikasi' && unread > 0 && <span className="side-badge">{unread}</span>}
          </NavLink>
        ))}

        <Link to="/" className="side-link mt-2">
          <AppIcon name="house-door" size={17} />
          Kembali ke Situs
        </Link>

        <button
          className="side-link logout-btn mt-3"
          onClick={() => { logout(); nav('/'); }}
        >
          <AppIcon name="box-arrow-right" size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
