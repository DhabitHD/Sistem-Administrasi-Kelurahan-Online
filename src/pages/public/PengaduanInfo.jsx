import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const steps = [
  ['01', 'Kategori'],
  ['02', 'Deskripsi'],
  ['03', 'Lokasi'],
  ['04', 'Foto bukti'],
  ['05', 'Kirim'],
];

export default function PengaduanInfo() {
  const { isLoggedIn } = useAuth();
  const target = isLoggedIn ? '/warga/pengaduan-baru' : '/login';

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">PENGADUAN</span>
        <h1>Sampaikan Pengaduan Warga</h1>
        <p className="lead">
          Kanal pengaduan membantu warga menyampaikan laporan terkait pelayanan
          atau lingkungan.
        </p>
      </div>

      <div className="row g-4 align-items-stretch">
        {/* Process steps */}
        <div className="col-lg-8">
          <div className="process-card">
            <div className="row g-3">
              {steps.map(([num, label]) => (
                <div className="col-sm" key={num}>
                  <div className="step">
                    <span>{num}</span>
                    <strong>{label}</strong>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <p className="text-muted mb-0">
              Warga yang sudah login dapat langsung membuat pengaduan melalui portal warga.
            </p>
          </div>
        </div>

        {/* CTA sidebar */}
        <div className="col-lg-4">
          <div className="side-card h-100">
            <h2 className="h5">Buat Pengaduan</h2>
            <p className="text-muted">
              {isLoggedIn ? 'Lanjutkan membuat laporan melalui portal warga.' : 'Warga perlu login untuk mengakses proses pengaduan.'}
            </p>
            <Link to={target} className="btn btn-brand">
              {isLoggedIn ? 'Buat Pengaduan Sekarang' : 'Login untuk Membuat Pengaduan'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
