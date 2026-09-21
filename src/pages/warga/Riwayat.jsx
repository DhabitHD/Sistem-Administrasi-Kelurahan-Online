import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useComplaints, useLetters } from '../../services/store.js';

const fileCount = (c) => (c.photos?.length || (c.photo ? 1 : 0) || (c.laporan_fotos?.length || (c.laporan_foto ? 1 : 0)));
const attachCount = (l) => (l.attachments?.length || 0);

export default function Riwayat() {
  const { items: complaints } = useComplaints();
  const { items: letters } = useLetters();
  const items = [
    ...(complaints).map((c) => ({ kind: 'Pengaduan', icon: 'chat-left-text', id: c.id_code, title: c.title, createdAt: c.created_at, status: c.status, link: '/warga/pengaduan', files: fileCount(c) })),
    ...(letters).map((l) => ({ kind: 'Surat', icon: 'file-earmark-text', id: l.id_code, title: l.jenis || l.title, createdAt: l.created_at, status: l.status, link: '/warga/surat', files: attachCount(l) })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Riwayat &amp; Tracking</h1>
        <p className="lead text-muted">
          Seluruh pengaduan dan pengajuan surat dalam satu kronologi.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <div className="service-icon mx-auto"><AppIcon name="clock-history" /></div>
          <h2 className="h5 mt-3">Belum ada riwayat</h2>
          <div className="mt-3">
            <Link to="/warga/pengaduan-baru" className="btn btn-brand">Buat Pengaduan</Link>
            <Link to="/warga/surat-baru" className="btn btn-outline-brand ms-2">Ajukan Surat</Link>
          </div>
        </div>
      ) : (
        <div className="dashboard-card p-4">
          {items.map((it, i) => (
            <div className="d-flex align-items-center gap-3 py-3 border-bottom border-light" key={it.id} style={i === 0 ? { paddingTop: 0 } : {}}>
              <div className="doc-icon flex-shrink-0"><AppIcon name={it.icon} size={18} /></div>
              <div className="flex-grow-1">
                <small className="text-brand fw-semibold d-block">{it.kind} · {it.id}</small>
                <strong className="d-block">{it.title}</strong>
                <small className="text-muted">{new Date(it.createdAt).toLocaleString('id-ID')}</small>
              </div>
              {it.files > 0 && (
                <span className="small text-muted d-inline-flex align-items-center gap-1 flex-shrink-0">
                  <AppIcon name="paperclip" size={14} className="text-brand" />{it.files}
                </span>
              )}
              <div className="text-end flex-shrink-0">
                <StatusBadge status={it.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}