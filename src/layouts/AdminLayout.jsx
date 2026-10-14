import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import AppIcon from '../components/common/AppIcon.jsx';
import ContentErrorBanner from '../components/common/ContentErrorBanner.jsx';

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
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  return (
    <div className="warga-shell">
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Tutup menu"
          onClick={close}
        />
      )}
      <aside className={`warga-sidebar admin-sidebar${open ? ' open' : ''}`} id="admin-sidebar">
        <div className="p-4 border-bottom sidebar-brand">
          <div className="d-flex align-items-center gap-2">
            <img src="/assets/placeholders/Logo-Kediri.png" className="brand-logo" alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <div>
              <strong>Kelurahan Betet</strong>
              <small className="d-block text-muted">Panel Admin</small>
            </div>
            <button
              type="button"
              className="sidebar-close d-lg-none ms-auto"
              onClick={close}
              aria-label="Tutup menu navigasi"
            >
              <AppIcon name="x" size={20} />
            </button>
          </div>
        </div>

        <div className="p-3 sidebar-nav">
          {links.map(([to, label, icon]) => (
            <NavLink className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} end={to === '/admin'} key={to} to={to} onClick={close}>
              <AppIcon name={icon} size={17} />
              <span className="flex-grow-1">{label}</span>
              <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
            </NavLink>
          ))}

          <Link to="/" className="side-link mt-2" onClick={close}>
            <AppIcon name="eye" size={17} />
            <span className="flex-grow-1">Lihat Situs</span>
            <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
          </Link>

          <button
            className="side-link logout-btn mt-3"
            onClick={() => { close(); logout(); nav('/login'); }}
          >
            <AppIcon name="box-arrow-right" size={17} />
            <span className="flex-grow-1">Logout</span>
            <AppIcon name="chevron-right" size={15} className="side-link__chevron" />
          </button>
        </div>
      </aside>

      <div className="warga-main">
        <header className="warga-topbar">
          <div className="container-fluid py-2 py-lg-3 d-flex align-items-center gap-2">
            <button
              type="button"
              className="topbar-toggle d-lg-none"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="admin-sidebar"
              aria-label="Buka menu navigasi"
            >
              <AppIcon name="list" size={22} />
            </button>
            <img
              src="/assets/placeholders/Logo-Kediri.png"
              alt="Logo Kelurahan Betet"
              className="d-lg-none"
              style={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <span className="text-muted d-flex align-items-center gap-2 small fw-semibold">
              <AppIcon name="shield-check" size={15} className="d-none d-lg-inline" />
              Portal Admin Kelurahan Betet
            </span>
          </div>
        </header>
        <main className="p-3 p-lg-4">
          <ContentErrorBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
