import AppIcon from '../../components/common/AppIcon.jsx';
import { usePerangkat } from '../../services/contentStore.js';

const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

export default function Pemerintahan() {
  const perangkat = usePerangkat();
  const staff = [...perangkat].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">PEMERINTAHAN</span>
        <h1 className="mt-3">Struktur Pemerintahan Kelurahan Betet</h1>
        <p className="lead">Susunan jabatan di bawah ini mengikuti informasi yang dipublikasikan pada website Kelurahan Betet dan dapat diperbarui ketika data resmi berubah.</p>
      </div>

      {staff.length === 0 ? (
        <div className="empty-state py-5"><p className="text-muted mb-0">Data perangkat kelurahan belum tersedia.</p></div>
      ) : (
        <div className="row g-4">
          {staff.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.slug}>
              <div className="staff-card h-100">
                <div className="staff-photo-wrap">
                  <span className="staff-photo-fallback">{initials(p.name)}</span>
                  {p.photo && (
                    <img
                      src={p.photo}
                      alt={`Foto ${p.role}`}
                      className="staff-photo"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  {!p.photo && <span className="staff-photo-note"><AppIcon name="camera" size={13} /></span>}
                </div>
                <div className="p-4 pt-3">
                  <small className="text-brand fw-bold">{p.role}</small>
                  <h2 className="h5 mt-1 mb-0">{p.name}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}