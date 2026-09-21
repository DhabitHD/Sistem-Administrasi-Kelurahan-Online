import { Link, Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import AppIcon from '../components/common/AppIcon.jsx';

const links = [
  ['/admin', 'Dashboard', 'layout-dashboard', true],
  ['/admin/warga', 'Warga & Verifikasi', 'people', false],
  ['/admin/pengaduan', 'Pengaduan', 'chat-left-text', false],
  ['/admin/surat', 'Layanan Surat', 'file-earmark-text', false],
  ['/admin/berita', 'Kelola Berita', 'file-text', false],
  ['/admin/pengumuman', 'Kelola Pengumuman', 'megaphone', false],
  ['/admin/dokumen', 'Dokumen & Info Publik', 'folder2-open', false],
  ['/admin/profil', 'Kelola Profil', 'person-badge', false],
  ['/admin/perangkat', 'Perangkat Kelurahan', 'people', false],
  ['/admin/admins', 'Kelola Admin', 'shield-check', false],
  ['/admin/petugas', 'Petugas Lapangan', 'user-cog', false],
  ['/admin/layanan', 'Kelola Layanan', 'shop', false],
  ['/admin/hero', 'Slide Halaman Utama', 'image', false],
  ['/admin/video', 'Kelola Video', 'play', false],
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="warga-shell">
      <aside className="warga-sidebar admin-sidebar">
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <img src="/assets/placeholders/logo-kelurahan.png" className="brand-logo" alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <div>
              <strong>Kelurahan Betet</strong>
              <small className="d-block text-muted">Panel Admin</small>
            </div>
          </div>
        </div>

        <div className="p-3">
          {links.map(([to, label, icon]) => (
            <NavLink className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} end={to === '/admin'} key={to} to={to}>
              <AppIcon name={icon} size={17} />
              {label}
            </NavLink>
          ))}

          <Link to="/" className="side-link mt-2">
            <AppIcon name="eye" size={17} />
            Lihat Situs
          </Link>

          <button
            className="side-link logout-btn mt-3"
            onClick={() => { logout(); nav('/login'); }}
          >
            <AppIcon name="box-arrow-right" size={17} />
            Logout
          </button>
        </div>
      </aside>

      <div className="warga-main">
        <header className="warga-topbar">
          <div className="container-fluid py-3">
            <span className="text-muted d-flex align-items-center gap-2">
              <AppIcon name="shield-check" size={15} />
              Portal Admin Kelurahan Betet
            </span>
          </div>
        </header>
        <main className="p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}