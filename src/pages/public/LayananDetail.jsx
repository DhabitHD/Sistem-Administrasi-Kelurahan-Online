import { Link, useParams, useNavigate } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useLayanan, useContentLoaded } from '../../services/contentStore.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function LayananDetail() {
  const { slug } = useParams();
  const layanan = useLayanan();
  const loaded = useContentLoaded('layanan');
  const item = layanan.find((x) => x.slug === slug);
  const { isLoggedIn } = useAuth();
  const nav = useNavigate();

  if (!item && !loaded) {
    return (
      <div className="container py-5" role="status" aria-live="polite">
        <div className="panel-card p-5 text-center">
          <div className="spinner-border text-brand" />
          <p className="text-muted small mt-3 mb-0">Memuat layanan…</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <div className="service-icon mx-auto">
            <AppIcon name="exclamation-triangle" />
          </div>
          <h1 className="h2 mt-3">Layanan tidak ditemukan</h1>
          <p className="text-muted">
            Layanan yang Anda cari tidak tersedia.
          </p>
          <Link to="/layanan" className="btn btn-brand mt-3">
            Kembali ke Layanan
          </Link>
        </div>
      </div>
    );
  }

  const imageIndex = (layanan.indexOf(item) % 4) + 1;
  const isLetter = item.slug.startsWith('surat-') || item.slug === 'kia';

  const handleAjukan = () => {
    if (isLoggedIn) {
      nav(`/warga/surat-baru?jenis=${item.slug}`);
    } else {
      nav('/login');
    }
  };

  return (
    <div className="container py-5">
      <div className="article-page">
        <span className="eyebrow text-brand">DETAIL LAYANAN</span>
        <h1 className="display-6 fw-bold mt-2">{item.name}</h1>
        <p className="lead text-muted">{item.short}</p>

        <div className="row g-5 mt-2">
          {/* Main content */}
          <div className="col-lg-7">
            <img
              src={`/assets/placeholders/layanan-${imageIndex}.jpg`}
              className="article-cover"
              alt={item.name}
            />

            {(item.requirements || []).length > 0 && (
              <>
                <h2 className="h4 mt-4">Persyaratan</h2>
                <ul>
                  {(item.requirements || []).map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="h4 mt-4">Proses</h2>
            <p>{item.process}</p>
          </div>

          {/* Sidebar */}
          <div className="col-lg-5">
            <div className="side-card">
              <h3 className="h5">Ajukan layanan</h3>
              {isLetter ? (
                <>
                  <p className="text-muted">
                    {isLoggedIn
                      ? 'Ajukan layanan ini melalui portal warga. Jenis surat akan terisi otomatis.'
                      : 'Login terlebih dahulu untuk mengajukan layanan ini.'}
                  </p>
                  <button className="btn btn-brand" onClick={handleAjukan}>
                    {isLoggedIn ? 'Ajukan Layanan Ini' : 'Login untuk Mengajukan'}
              </button>
                </>
              ) : (
                <p className="text-muted mb-0">
                  Layanan ini diproses langsung di loket kelurahan pada jam layanan.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
