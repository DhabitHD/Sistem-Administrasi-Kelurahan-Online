import { useEffect, useState } from 'react';
import { adminComplaints, listOfficers, setItemStatus, assignOfficer, closeComplaint, uploadDataUrl } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AttachmentList, safeUrl } from '../../services/files.jsx';
import AppModal from '../../components/common/AppModal.jsx';

const statuses = ['DIAJUKAN', 'IN_PROGRESS', 'CLOSED', 'DITOLAK'];

const fmt = (n) => String(n ?? 0).padStart(2, '0');

/* Petugas rows are allowed to have no wa (kontak-saja officers), so this must
   return null rather than throwing — a bare .replace here used to take down the
   whole page. Mirrors AdminSurat.jsx:9. */
const waLink = (wa) => (wa ? `https://wa.me/${String(wa).replace(/^0/, '62')}` : null);

export default function AdminPengaduan() {
  const [items, setItems] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [closeText, setCloseText] = useState('');
  const [closeFoto, setCloseFoto] = useState(null);
  const [closing, setClosing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  /* Swallowing the error and returning [] makes a dead backend look identical to
     "no complaints exist", which is a dangerous thing to show an admin. */
  const refresh = () =>
    adminComplaints()
      .then((d) => { setItems(d); setLoadError(''); })
      .catch((e) => { setItems([]); setLoadError(e.message || 'Gagal memuat pengaduan.'); });

  useEffect(() => {
    refresh();
    listOfficers()
      .then(setOfficers)
      .catch(() => setErr('Gagal memuat daftar petugas. Nama petugas mungkin tidak lengkap.'));
  }, []);

  useEffect(() => {
    const openId = location.state?.openId;
    if (!openId) return;
    const found = items.find((c) => c.id === openId);
    /* items is still [] on the first run while the fetch is in flight. Clearing the
       state here would drop the deep link from AdminDashboard before it can resolve.
       Bail silently while still loading; once the list is in, also clear the state
       on a miss so it does not linger for the rest of the session. */
    if (!found) {
      if (items.length > 0) navigate(location.pathname, { replace: true, state: null });
      return;
    }
    openDetail(found);
    navigate(location.pathname, { replace: true, state: null });
  }, [items, location.state?.openId]);

  const change = async (id, status) => {
    const target = items.find((c) => c.id === id);
    /* Mirrors AdminSurat.change(): the <select> sits on a clickable card, so a
       mis-click silently advanced a complaint with no way back. */
    if (!window.confirm(`Ubah status pengaduan ${target?.id_code || id} menjadi ${status}?`)) return;
    setMsg(''); setErr('');
    try {
      await setItemStatus('pengaduan', id, status);
      setMsg(`Status pengaduan ${target?.id_code || id} diubah menjadi ${status}.`);
    } catch (e) {
      setErr(e.message || 'Gagal mengubah status.');
    }
    refresh();
  };

  const openDetail = (c) => {
    setMsg(''); setErr('');
    setAssignTo('');
    setCloseText('');
    setCloseFoto(null);
    setDetail(c);
  };

  const onCloseFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErr('File harus berupa gambar.');
      return;
    }
    if (file.size > 500 * 1024) {
      setErr('Ukuran foto maksimal 500 KB. Pilih foto yang lebih kecil.');
      return;
    }
    setErr('');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setCloseFoto(await uploadDataUrl(reader.result));
      } catch (e2) {
        setErr(e2.message || 'Gagal mengunggah gambar.');
      }
    };
    reader.readAsDataURL(file);
  };

  const doClose = async () => {
    if (!closeText.trim()) { setErr('Isi laporan penutupan terlebih dahulu.'); return; }
    setClosing(true); setErr(''); setMsg('');
    try {
      const res = await closeComplaint(detail.id, { laporan: closeText.trim(), laporan_foto: closeFoto || null });
      setMsg(`Pengaduan ${detail.id_code} ditutup. Laporan tersimpan.`);
      setDetail({ ...detail, status: res.status, laporan: res.laporan, laporan_foto: res.laporan_foto });
      refresh();
    } catch (e) {
      setErr(e.message || 'Gagal menutup pengaduan.');
    } finally {
      setClosing(false);
    }
  };

  const doAssign = async () => {
    if (!assignTo) { setErr('Pilih petugas terlebih dahulu.'); return; }
    setAssigning(true); setErr(''); setMsg('');
    try {
      const res = await assignOfficer(detail.id, Number(assignTo));
      setMsg(`Pengaduan ${detail.id_code} diplot ke ${res.petugas.nama}. Detail dikirim via WhatsApp.`);
      setDetail({ ...detail, petugas: res.petugas, status: res.item.status });
      if (res.wa_link) window.open(res.wa_link, '_blank', 'noopener');
      refresh();
    } catch (e) {
      setErr(e.message || 'Gagal menugaskan petugas.');
    } finally {
      setAssigning(false);
    }
  };

  const filtered = items.filter(
    (c) => !q || `${c.id_code} ${c.title} ${c.owner} ${c.category} RT${c.rt} RW${c.rw} ${c.petugas?.nama || ''}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Pengaduan</h1>
        <p className="lead text-muted mb-0">Lihat detail pengaduan warga dan plot ke petugas lapangan.</p>
      </div>

      <div className="col-md-5 mb-4 ps-0">
        <div className="input-group">
          <span className="input-group-text bg-white"><AppIcon name="search" /></span>
          <input className="form-control" placeholder="Cari pengaduan…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari pengaduan" />
        </div>
      </div>

      {msg && <div className="mb-3 alert alert-success py-2">{msg}</div>}
      {err && <div className="mb-3 alert alert-danger py-2">{err}</div>}
      {loadError && <div className="mb-3 alert alert-danger py-2" role="alert">Data pengaduan gagal dimuat: {loadError}</div>}

      {filtered.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <p className="text-muted mb-0">{loadError ? 'Data tidak dapat ditampilkan.' : 'Tidak ada pengaduan.'}</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((c) => (
            <div className="col-lg-6" key={c.id}>
              <div
                className="dashboard-card p-4 card-click"
                role="button"
                tabIndex={0}
                onClick={() => openDetail(c)}
                onKeyDown={(e) => {
                  /* This card contains a status <select> and a WhatsApp link.
                     Keydown from either bubbles here, and this handler's
                     e.preventDefault() would swallow it — the select became
                     unusable by keyboard. */
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(c); }
                }}

                aria-label={`Detail ${c.id_code}`}
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <small className="text-muted">{c.id_code} · {new Date(c.created_at).toLocaleString('id-ID')}</small>
                    <h3 className="h5 mt-1 mb-1">{c.title}</h3>
                    <span className="text-brand small fw-semibold">{c.category}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-muted small mt-3 mb-1">{c.description}</p>
                <p className="small mb-0"><AppIcon name="geo-alt" className="me-1 text-brand" />RT {fmt(c.rt)} / RW {fmt(c.rw)}</p>
                <p className="small text-muted mb-0 mt-1">Oleh <strong>{c.owner}</strong></p>
                {c.petugas && (
                  <p className="small mb-0 mt-1">
                    <AppIcon name="user-cog" className="me-1 text-brand" />
                    Petugas: <strong>{c.petugas.nama}</strong>
                    {waLink(c.petugas.wa) && (
                      <>
                        {' · '}
                        <a
                          href={waLink(c.petugas.wa)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand"
                          onClick={(e) => e.stopPropagation()}
                        >chat</a>
                      </>
                    )}
                  </p>
                )}
                <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 flex-wrap">
                  <span className="small text-muted"><AppIcon name="eye" className="me-1" />Klik kartu untuk detail lengkap &amp; plot petugas.</span>
                  {(c.status !== 'CLOSED' && c.status !== 'DITOLAK') && <span className="small text-muted ms-2">Ubah status:</span>}
                  {(c.status !== 'CLOSED' && c.status !== 'DITOLAK') && (
                    <select
                      className="form-select form-select-sm"
                      style={{ maxWidth: 190 }}
                      value={c.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => change(c.id, e.target.value)}
                      aria-label={`Status ${c.id_code}`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <AppModal onClose={() => setDetail(null)} label={`Detail pengaduan ${detail.id_code}`}>
            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
              <div>
                <h3 className="h5 mb-1">{detail.title}</h3>
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
                  <tr><th scope="row" className="text-muted fw-normal">Pengadu</th><td>{detail.owner}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Kategori</th><td>{detail.category}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Deskripsi</th><td>{detail.description}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Lokasi</th><td>RT {fmt(detail.rt)} / RW {fmt(detail.rw)}{safeUrl(detail.gmaps_link) && <> · <a href={safeUrl(detail.gmaps_link)} target="_blank" rel="noreferrer" className="text-brand">Lihat peta</a></>}</td></tr>
                </tbody>
              </table>
            </div>

            {detail.photos?.length || detail.photo ? (
              <div className="mt-3">
                <strong className="d-block small mb-2">Foto bukti ({(detail.photos?.length || 1)})</strong>
                <div className="d-flex flex-wrap gap-2">
                  {(detail.photos?.length ? detail.photos : [detail.photo]).map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer">
                      <img src={src} alt={`Foto bukti ${detail.id_code} ${i + 1}`} className="rounded" style={{ width: 96, height: 72, objectFit: 'cover' }} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {detail.laporan && (
              <div className="mt-3 pt-3 border-top">
                <strong className="d-block mb-1"><AppIcon name="file-text" className="me-1 text-brand" />Laporan Penutupan</strong>
                <p className="small text-muted mb-2">{detail.laporan}</p>
                <AttachmentList files={detail.laporan_fotos || (detail.laporan_foto ? [detail.laporan_foto] : [])} title="Foto penutupan" />
              </div>
            )}

            {!['CLOSED', 'DITOLAK'].includes(detail.status) && (
              <div className="mt-3 pt-3 border-top">
                <strong className="d-block mb-1"><AppIcon name="file-text" className="me-1 text-brand" />Tutup Pengaduan dengan Laporan</strong>
                <p className="small text-muted mb-2">Administrasi bisa menutup pengaduan beserta laporan hasil penanganan. Laporan tercantum dan terlihat oleh warga.</p>
                <label className="form-label fw-semibold" htmlFor="admin-close-laporan">Laporan hasil penanganan</label>
                <textarea id="admin-close-laporan" rows="3" className="form-control mb-2" placeholder="Uraian laporan hasil penanganan…" value={closeText} onChange={(e) => setCloseText(e.target.value)}></textarea>
                <div className="mb-2">
                  <label className="form-label fw-semibold" htmlFor="admin-close-foto">Foto bukti penanganan (opsional)</label>
                  <input id="admin-close-foto" type="file" accept="image/*" className="form-control" onChange={onCloseFoto} />
                  {closeFoto && <img src={closeFoto} className="upload-preview mt-2" alt="Pratinjau foto laporan" />}
                </div>
                <button className="btn btn-sm btn-brand" disabled={closing} onClick={doClose}>
                  {closing ? 'Menyimpan…' : 'Kirim & Tutup Pengaduan'} <AppIcon name="send" className="ms-1" />
                </button>
              </div>
            )}

            <div className="mt-3 pt-3 border-top">
              <strong className="d-block mb-2"><AppIcon name="user-cog" className="me-1 text-brand" />Plot Petugas Lapangan</strong>
              {detail.petugas
                ? (
                  <p className="small mb-2">
                    Sedang ditangani <strong>{detail.petugas.nama}</strong> ({detail.petugas.wa}).
                    Gunakan form di bawah untuk mengganti petugas.
                  </p>
                )
                : <p className="small text-muted mb-2">Belum ada petugas yang menangani pengaduan ini.</p>}
              {officers.length === 0 ? (
                <p className="small text-muted mb-0">
                  Belum ada data petugas.{' '}
                  <Link to="/admin/petugas" className="text-brand">Tambah petugas di sini</Link>.
                </p>
              ) : (
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <select
                    className="form-select form-select-sm"
                    style={{ maxWidth: 260 }}
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    aria-label="Pilih petugas"
                  >
                    <option value="">— Pilih petugas —</option>
                    {officers.map((o) => <option key={o.id} value={o.id}>{o.nama} ({o.wa})</option>)}
                  </select>
                  <button className="btn btn-sm btn-brand" disabled={assigning || !assignTo} onClick={doAssign}>
                    {assigning ? 'Menyimpan…' : 'Tugaskan & Kirim WA'}
                    <AppIcon name="send" className="ms-1" />
                  </button>
                </div>
              )}
            </div>
        </AppModal>
      )}
    </div>
  );
}
