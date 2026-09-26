import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminLetters, setItemStatus } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import { AttachmentList } from '../../services/files.jsx';

const statuses = ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL', 'CLOSED', 'DITOLAK'];
const waLink = (wa) => (wa ? `https://wa.me/${String(wa).replace(/^0/, '62')}` : null);

export default function AdminSurat() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const refresh = () => adminLetters().then(setItems).catch(() => setItems([]));

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const openId = location.state?.openId;
    if (!openId) return;
    const found = items.find((l) => l.id === openId);
    if (found) setDetail(found);
    navigate(location.pathname, { replace: true, state: null });
  }, [items]);

  const change = async (id, status) => {
    setMsg(''); setErr('');
    if (!window.confirm(`Ubah status ${id === detail?.id ? detail.id_code : id} menjadi ${status}?`)) {
      refresh();
      return;
    }
    try {
      await setItemStatus('surat', id, status);
      setMsg(`Status ${id} diubah menjadi ${status}.`);
      setDetail((d) => (d && d.id === id ? { ...d, status } : d));
    } catch (e) {
      setErr(e.message || 'Gagal mengubah status.');
    }
    refresh();
  };

  const filtered = items.filter(
    (l) =>
      (filter === 'Semua' || l.status === filter) &&
      (!q || `${l.id_code} ${l.jenis || l.title} ${l.owner} ${l.description}`.toLowerCase().includes(q.toLowerCase()))
  );

  const countFor = (s) => (s === 'Semua' ? items.length : items.filter((x) => x.status === s).length);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Layanan Surat</h1>
        <p className="lead text-muted mb-0">Periksa data pengajuan warga (termasuk lampiran) lalu perbarui statusnya.</p>
      </div>

      <div className="col-md-5 mb-4 ps-0">
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input className="form-control" placeholder="Cari id kode, jenis, nama…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari pengajuan surat" />
        </div>
      </div>

      <div className="d-flex gap-2 flex-wrap mb-3">
        {['Semua', ...statuses].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-brand' : 'btn-outline-brand'}`}
            onClick={() => setFilter(s)}
          >
            {s} <span className={`badge ${filter === s ? 'text-bg-light' : 'text-bg-secondary'}`}>{countFor(s)}</span>
          </button>
        ))}
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
                <p className="small text-muted mb-0 mt-1">
                  Oleh <strong>{l.owner}</strong>
                  {l.nik && <> · NIK {l.nik}</>}
                </p>
                {(l.attachments?.length > 0) && (
                  <p className="small text-brand mb-0 mt-1"><AppIcon name="paperclip" className="me-1" />{l.attachments.length} lampiran</p>
                )}
                <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 flex-wrap">
                  <span className="small text-muted"><AppIcon name="eye" className="me-1" />Klik kartu untuk periksa &amp; validasi.</span>
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
              <table className="table table-sm mb-0 align-middle">
                <tbody>
                  <tr><th scope="row" className="text-muted fw-normal" style={{ width: '22%' }}>Pengaju</th><td><strong>{detail.owner}</strong></td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">NIK</th><td>{detail.nik || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">KK</th><td>{detail.kk || '-'}</td></tr>
                  <tr>
                    <th scope="row" className="text-muted fw-normal">WhatsApp</th>
                    <td>
                      {detail.wa ? (
                        <a href={waLink(detail.wa)} target="_blank" rel="noreferrer" className="text-brand text-decoration-none">
                          {detail.wa} <AppIcon name="box-arrow-up-right" size={14} />
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                  <tr><th scope="row" className="text-muted fw-normal">Email</th><td>{detail.email || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Alamat</th><td>{detail.alamat || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Jenis</th><td>{detail.jenis || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Deskripsi</th><td>{detail.description}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Catatan</th><td>{detail.catatan || '-'}</td></tr>
                </tbody>
              </table>
            </div>

            {detail.ktp && (
              <div className="mt-3">
                <strong className="d-block small mb-2"><AppIcon name="credit-card-2-front" size={14} className="me-1 text-brand" />Foto KTP</strong>
                <a href={detail.ktp} target="_blank" rel="noreferrer">
                  <img src={detail.ktp} alt="Foto KTP pengaju" loading="lazy" className="rounded" style={{ width: 96, height: 72, objectFit: 'cover' }} />
                </a>
              </div>
            )}

            <AttachmentList files={detail.attachments} title="Lampiran" />

            {!['CLOSED', 'DITOLAK'].includes(detail.status) && (
              <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 flex-wrap">
                <strong className="small mb-0">Ubah status:</strong>
                <select
                  className="form-select form-select-sm"
                  style={{ maxWidth: 220 }}
                  value={detail.status}
                  onChange={(e) => change(detail.id, e.target.value)}
                  aria-label={`Ubah status ${detail.id_code}`}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="small text-muted">Data sudah diperiksa? Tandai status pengajuan.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}