import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';

export default function Verifikasi() {
  return (
    <div className="container py-5">
      <div className="empty-state">
        <div className="service-icon mx-auto">
          <AppIcon name="hourglass-split" size={30} />
        </div>
        <h1 className="h2 mt-3">Menunggu Verifikasi</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
          Pendaftaran Anda telah diterima. Admin kelurahan akan meninjau data dan
          foto KTP Anda. Setelah diverifikasi, Anda dapat masuk menggunakan NIK
          atau email dan password yang didaftarkan.
        </p>
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <Link to="/login" className="btn btn-brand">
            Coba Masuk Sekarang
          </Link>
          <Link to="/" className="btn btn-outline-brand">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}