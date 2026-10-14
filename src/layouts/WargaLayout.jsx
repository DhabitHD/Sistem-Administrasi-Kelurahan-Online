import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import WargaSidebar from '../components/layout/WargaSidebar.jsx';
import AppIcon from '../components/common/AppIcon.jsx';
import ContentErrorBanner from '../components/common/ContentErrorBanner.jsx';

export default function WargaLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
      <WargaSidebar open={open} onClose={() => setOpen(false)} />
      <div className="warga-main">
        <header className="warga-topbar">
          <div className="container-fluid py-2 py-lg-3 d-flex align-items-center gap-2">
            <button
              type="button"
              className="topbar-toggle d-lg-none"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="warga-sidebar"
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
              <AppIcon name="grid" size={15} className="d-none d-lg-inline" />
              Portal Warga / Dashboard
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
