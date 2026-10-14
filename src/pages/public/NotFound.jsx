import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';

export default function NotFound() {
  return (
    <div className="container py-5">
      <div className="empty-state">
        <div className="service-icon mx-auto">
          <AppIcon name="compass" />
        </div>
        <span className="eyebrow text-brand">ERROR 404</span>
        <h1 className="display-4 mt-2">Halaman tidak ditemukan</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
          Alamat yang Anda tuju tidak tersedia, telah dipindah, atau tautannya salah.
          Periksa kembali atau kembali ke beranda.
        </p>
        <div className="d-flex justify-content-center gap-2 flex-column flex-sm-row">
          <Link to="/" className="btn btn-brand">Kembali ke Beranda</Link>
          <Link to="/layanan" className="btn btn-outline-brand">Lihat Layanan</Link>
        </div>
      </div>
    </div>
  );
}