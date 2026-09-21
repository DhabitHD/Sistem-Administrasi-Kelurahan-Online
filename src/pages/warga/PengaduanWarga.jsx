import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import StatusTimeline from '../../components/common/StatusTimeline.jsx';
import { useComplaints } from '../../services/store.js';
import { AttachmentList } from '../../services/files.jsx';

const fmt = (n) => String(n ?? 0).padStart(2, '0');

export default function PengaduanWarga() {
  const [open, setOpen] = useState(null);
  const [preview, setPreview] = useState(null);
  const { items: complaints } = useComplaints();

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Pengaduan Saya</h1>
        <p className="lead text-muted mb-3">
          Pantau status laporan yang pernah diajukan.
        </p>
        <Link to="/warga/pengaduan-baru" className="btn btn-brand">
          <AppIcon name="plus-lg" className="me-1" /> Pengaduan Baru
        </Link>
      </div>

      {complaints.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <div className="service-icon mx-auto"><AppIcon name="inbox" /></div>
          <h2 className="h5 mt-3">Belum ada pengaduan</h2>
          <p className="text-muted">Ajukan pengaduan pertamamu untuk mulai memantau layanan.</p>
        </div>
      ) : (
        <div className="row g-4">
          {complaints.map((c) => (
            <div className="col-lg-6" key={c.id}>
              <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <small className="text-muted">{c.id_code} · {new Date(c.created_at).toLocaleDateString('id-ID')}</small>
                    <h3 className="h5 mt-1 mb-1">{c.title}</h3>
                    <span className="text-brand small fw-semibold">{c.category}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-muted small mt-3 mb-1">{c.description}</p>
                <p className="small mb-0"><AppIcon name="geo-alt" className="me-1 text-brand" />RT {fmt(c.rt)} / RW {fmt(c.rw)}{c.gmaps_link && <> · <a href={c.gmaps_link} target="_blank" rel="noreferrer" className="text-brand text-decoration-none">Lihat peta</a></>}</p>
                {c.laporan && (
                  <div className="small mt-2 pt-2 border-top border-light">
                    <strong className="d-block mb-1">Laporan penutupan:</strong>
                    <p className="text-muted mb-1">{c.laporan}</p>
                    <AttachmentList files={c.laporan_fotos || (c.laporan_foto ? [c.laporan_foto] : [])} title="Foto laporan" />
                  </div>
                )}
                {(c.photos?.length || c.photo) && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {(c.photos?.length ? c.photos : [c.photo]).map((src, i) => (
                      <button key={i} type="button" className="photo-frame photo-thumb" onClick={() => setPreview({ src, title: `${c.id_code} · Foto bukti ${c.photos?.length > 1 ? i + 1 : ''}` })}>
                        <img src={src} alt={`Foto bukti ${c.id} ${i + 1}`} onError={(e) => { e.currentTarget.closest('.photo-frame').style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className="btn btn-sm btn-outline-brand mt-3"
                  onClick={() => setOpen((cur) => (cur === c.id ? null : c.id))}
                >
                  <AppIcon name={open === c.id ? 'chevron-up' : 'chevron-down'} className="me-1" />
                  {open === c.id ? 'Tutup detail' : 'Riwayat status'}
                </button>
                {open === c.id && (
                  <div className="mt-3 pt-3 border-top">
                    <StatusTimeline kind="pengaduan" status={c.status} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="ktp-lightbox" onClick={() => setPreview(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
              <div>
                <strong>{preview.title}</strong>
              </div>
              <button className="btn btn-sm btn-outline-brand flex-shrink-0" onClick={() => setPreview(null)}>Tutup</button>
            </div>
            <img src={preview.src} alt={preview.title} className="w-100 rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
