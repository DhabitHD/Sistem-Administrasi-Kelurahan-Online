import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import StatusTimeline from '../../components/common/StatusTimeline.jsx';
import { useLetters } from '../../services/store.js';
import { AttachmentList } from '../../services/files.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

export default function SuratWarga() {
  const [open, setOpen] = useState(null);
  const { items: letters, error } = useLetters();

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Layanan Surat Saya</h1>
        <p className="lead text-muted mb-3">
          Daftar pengajuan surat dan statusnya.
        </p>
        <Link to="/warga/surat-baru" className="btn btn-brand">
          <AppIcon name="plus-lg" className="me-1" /> Ajukan Surat
        </Link>
      </div>

      {error && (
        <AppAlert type="danger">
          Gagal memuat pengajuan surat dari server ({error}). Data Anda aman — coba muat ulang halaman.
        </AppAlert>
      )}

      {!error && (letters.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <div className="service-icon mx-auto"><AppIcon name="folder2-open" /></div>
          <h2 className="h5 mt-3">Belum ada pengajuan surat</h2>
          <p className="text-muted">Ajukan surat pertama untuk mulai menggunakan layanan ini.</p>
        </div>
      ) : (
        <div className="row g-4">
          {letters.map((l) => (
            <div className="col-lg-6" key={l.id}>
              <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <small className="text-muted">{l.id_code} · {new Date(l.created_at).toLocaleDateString('id-ID')}</small>
                    <h3 className="h5 mt-1 mb-1">{l.jenis || l.title}</h3>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
                <p className="text-muted small mt-3 mb-1">{l.description}</p>
                {l.catatan && <p className="small mb-0 text-muted"><AppIcon name="sticky" className="me-1 text-brand" />{l.catatan}</p>}
                <AttachmentList files={l.attachments} title="Lampiran" />

                <button
                  className="btn btn-sm btn-outline-brand mt-3"
                  onClick={() => setOpen((cur) => (cur === l.id ? null : l.id))}
                >
                  <AppIcon name={open === l.id ? 'chevron-up' : 'chevron-down'} className="me-1" />
                  {open === l.id ? 'Tutup detail' : 'Riwayat status'}
                </button>
                {open === l.id && (
                  <div className="mt-3 pt-3 border-top">
                    <StatusTimeline kind="surat" status={l.status} />
                    {l.status === 'SIAP_DIAMBIL' && <div className="text-brand mt-2"><AppIcon name="geo-alt" className="me-1" />Ambil di kantor Kelurahan Betet</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}