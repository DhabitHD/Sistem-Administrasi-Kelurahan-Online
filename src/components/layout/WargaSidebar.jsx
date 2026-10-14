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

export default function WargaSidebar({ open = false, onClose }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const unread = user?.notif_unread || 0;

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Tutup menu"
          onClick={onClose}
        />
      )}
      <aside className={`warga-sidebar${open ? ' open' : ''}`} id="warga-sidebar">
        {/* Brand */}
        <div className="p-4 border-bottom sidebar-brand">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/assets/placeholders/Logo-Kediri.png"
              className="brand-logo"
              alt="Logo"
              style={{ width: 40, height: 40, objectFit: 'contain' }}
            />
            <div>
              <strong>Kelurahan Betet</strong>
              <small className="d-block text-muted">Panel Warga</small>
            </div>
            <button
              type="button"
              className="sidebar-close d-lg-none ms-auto"
              onClick={onClose}
              aria-label="Tutup menu navigasi"
            >
              <AppIcon name="x" size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 sidebar-nav">
          {links.map(([to, label, icon]) => (
            <NavLink
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              end={to === '/warga'}
              key={to}
              to={to}
              onClick={onClose}
            >
              <AppIcon name={icon} size={17} />
              <span className="flex-grow-1">{label}</span>
              {to === '/warga/notifikasi' && unread > 0 && <span className="side-badge">{unread}</span>}
              <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
            </NavLink>
          ))}

          <Link to="/" className="side-link mt-2" onClick={onClose}>
            <AppIcon name="house-door" size={17} />
            <span className="flex-grow-1">Kembali ke Situs</span>
            <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
          </Link>

          <button
            className="side-link logout-btn mt-3"
            onClick={() => { onClose?.(); logout(); nav('/'); }}
          >
            <AppIcon name="box-arrow-right" size={17} />
            <span className="flex-grow-1">Logout</span>
            <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
          </button>
        </div>
      </aside>
    </>
  );
}
