import { useEffect, useState } from 'react';
import { adminLetters, setItemStatus } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import { AttachmentList } from '../../services/files.jsx';

const statuses = ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL', 'CLOSED', 'DITOLAK'];

export default function AdminSurat() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null);

  const refresh = () => adminLetters().then(setItems).catch(() => setItems([]));

  useEffect(() => {
    refresh();
  }, []);

  const change = async (id, status) => {
    setMsg(''); setErr('');
    try {
      await setItemStatus('surat', id, status);
      setMsg(`Status ${id} diubah menjadi ${status}.`);
      refresh();
    } catch (e) {
      setErr(e.message || 'Gagal mengubah status.');
      refresh();
    }
  };

  const filtered = items.filter(
    (l) => !q || `${l.id_code} ${l.jenis || l.title} ${l.owner}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Layanan Surat</h1>
        <p className="lead text-muted mb-0">Lihat detail pengajuan surat warga dan perbarui statusnya.</p>
      </div>

      <div className="col-md-5 mb-4 ps-0">
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input className="form-control" placeholder="Cari pengajuan surat…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari pengajuan surat" />
        </div>
      </div>

      {msg && <div className="mb-3 alert alert-success py-2">{msg}</div>}
      {err && <div className="mb-3 alert alert-danger py-2">{err}</div>}

      {filtered.length === 0 ? (
        <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Tidak ada pengajuan surat.</p></div>
      ) : (
        <div className="row g-4">
          {filtered.map((l) => (
            <div className="col-lg-6" key={l.id}>
              <div
                className="dashboard-card p-4 card-click"
                role="button"
                tabIndex={0}
                onClick={() => { setMsg(''); setErr(''); setDetail(l); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMsg(''); setErr(''); setDetail(l); } }}
                aria-label={`Detail ${l.id_code}`}
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <small className="text-muted">{l.id_code} · {new Date(l.created_at).toLocaleString('id-ID')}</small>
                    <h3 className="h5 mt-1 mb-1">{l.jenis || l.title}</h3>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
                <p className="text-muted small mt-3 mb-1">{l.description}</p>
                {l.catatan && <p className="small text-muted mb-0"><AppIcon name="sticky" className="me-1 text-brand" />{l.catatan}</p>}
                <p className="small text-muted mb-0 mt-1">Oleh <strong>{l.owner}</strong></p>
                <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 flex-wrap">
                  <span className="small text-muted"><AppIcon name="eye" className="me-1" />Klik kartu untuk melihat detail pengajuan.</span>
                  <span className="small text-muted">Ubah status:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ maxWidth: 220 }}
                    value={l.status}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => change(l.id, e.target.value)}
                    disabled={['CLOSED', 'DITOLAK'].includes(l.status)}
                    aria-label={`Status ${l.id}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div className="ktp-lightbox" onClick={() => setDetail(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
              <div>
                <h3 className="h5 mb-1">{detail.jenis || detail.title}</h3>
                <small className="text-muted d-block">
                  {detail.id_code} · {new Date(detail.created_at).toLocaleString('id-ID')}
                </small>
              </div>
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <StatusBadge status={detail.status} />
                <button className="btn btn-sm btn-outline-brand" onClick={() => setDetail(null)}>Tutup</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr><th scope="row" className="text-muted fw-normal">Pengaju</th><td>{detail.owner}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Jenis</th><td>{detail.jenis || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Deskripsi</th><td>{detail.description}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Catatan</th><td>{detail.catatan || '-'}</td></tr>
                </tbody>
              </table>
            </div>
            <AttachmentList files={detail.attachments} title="Lampiran" />
          </div>
        </div>
      )}
    </div>
  );
}
