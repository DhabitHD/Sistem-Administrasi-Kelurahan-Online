import { Outlet } from 'react-router-dom';
import WargaSidebar from '../components/layout/WargaSidebar.jsx';
import AppIcon from '../components/common/AppIcon.jsx';
import ContentErrorBanner from '../components/common/ContentErrorBanner.jsx';

export default function WargaLayout() {
  return (
    <div className="warga-shell">
      <WargaSidebar />
      <div className="warga-main">
        <header className="warga-topbar">
          <div className="container-fluid py-3">
            <span className="text-muted d-flex align-items-center gap-2">
              <AppIcon name="grid" size={15} />
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
