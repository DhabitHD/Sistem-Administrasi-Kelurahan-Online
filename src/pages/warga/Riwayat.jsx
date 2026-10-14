import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useComplaints, useLetters, cancelComplaint, cancelLetter } from '../../services/store.js';
import AppAlert from '../../components/common/AppAlert.jsx';

const fileCount = (c) => (c.photos?.length || (c.photo ? 1 : 0) || (c.laporan_fotos?.length || (c.laporan_foto ? 1 : 0)));
const attachCount = (l) => (l.attachments?.length || 0);

export default function Riwayat() {
  const { items: complaints, error: cErr, reload: reloadC } = useComplaints();
  const { items: letters, error: lErr, reload: reloadL } = useLetters();
  const [busy, setBusy] = useState('');
  const [info, setInfo] = useState('');
  const error = cErr || lErr;
  const items = [
    ...(complaints).map((c) => ({ kind: 'Pengaduan', icon: 'chat-left-text', id: c.id_code, dbId: c.id, title: c.title, createdAt: c.created_at, status: c.status, link: '/warga/pengaduan', files: fileCount(c) })),
    ...(letters).map((l) => ({ kind: 'Surat', icon: 'file-earmark-text', id: l.id_code, dbId: l.id, title: l.jenis || l.title, createdAt: l.created_at, status: l.status, link: '/warga/surat', files: attachCount(l) })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const onCancel = async (it) => {
    if (!window.confirm(`Batalkan ${it.kind} ${it.id}?`)) return;
    setBusy(it.id);
    setInfo('');
    try {
      if (it.kind === 'Pengaduan') await cancelComplaint(it.dbId);
      else await cancelLetter(it.dbId);
      await Promise.all([reloadC(), reloadL()]);
      setInfo(`${it.kind} ${it.id} dibatalkan.`);
    } catch (e) {
      setInfo(`Gagal membatalkan: ${e?.message || 'coba lagi'}`);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Riwayat &amp; Tracking</h1>
        <p className="lead text-muted">
          Seluruh pengaduan dan pengajuan surat dalam satu kronologi.
        </p>
      </div>

      {error && (
        <AppAlert type="danger">
          Gagal memuat riwayat dari server ({error}). Data Anda aman — coba muat ulang halaman.
        </AppAlert>
      )}
      {info && <AppAlert type="info">{info}</AppAlert>}

      {!error && (items.length === 0 ? (
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
              <div className="text-end flex-shrink-0 d-flex flex-column gap-2 align-items-end">
                <StatusBadge status={it.status} />
                {(it.status === 'DIAJUKAN' || it.status === 'IN_PROGRESS') && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={busy === it.id}
                    onClick={() => onCancel(it)}
                  >
                    {busy === it.id ? 'Membatalkan…' : 'Batalkan'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}