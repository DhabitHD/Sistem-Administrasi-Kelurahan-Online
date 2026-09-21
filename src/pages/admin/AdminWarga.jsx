import { useEffect, useState } from 'react';
import { listWarga, setWargaStatus } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const filters = ['Semua', 'PENDING', 'VERIFIED', 'REJECTED'];

const fmtTanggal = (d) => {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

export default function AdminWarga() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [ktpView, setKtpView] = useState(null);
  const [detail, setDetail] = useState(null);
  const [review, setReview] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = () => listWarga().then(setUsers).catch(() => setUsers([]));

  useEffect(() => {
    refresh();
  }, []);

  const setStatus = async (nik, status) => {
    setSaving(true);
    try {
      await setWargaStatus(nik, status, note);
      setMsg(`Status ${nik} diubah menjadi ${status}.${note.trim() ? ' Catatan terkirim ke warga.' : ''}`);
      setReview(null);
      setNote('');
      refresh();
    } catch (e) {
      setErr(e.message || 'Gagal mengubah status.');
    } finally {
      setSaving(false);
    }
  };

  const openReview = (u, status) => {
    setErr(''); setNote('');
    setReview({ u, status });
  };

  const items = users.filter(
    (u) =>
      (filter === 'Semua' || u.status === filter) &&
      (!q || `${u.name} ${u.nik} ${u.email || ''}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Warga &amp; Verifikasi</h1>
        <p className="lead text-muted mb-0">Periksa identitas (foto profil &amp; KTP) lalu verifikasi atau tolak pendaftar.</p>
      </div>

      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white"><AppIcon name="search" /></span>
            <input className="form-control" placeholder="Cari nama, NIK, email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari warga" />
          </div>
        </div>
        <div className="col-md-7">
          <div className="d-flex gap-2 flex-wrap justify-content-md-end">
            {filters.map((f) => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-brand' : 'btn-outline-brand'}`} onClick={() => setFilter(f)}>
                {f === 'Semua' ? 'Semua' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {msg && <div className="mb-3"><AppAlert type="success">{msg}</AppAlert></div>}
      {err && <div className="mb-3"><AppAlert type="danger">{err}</AppAlert></div>}

      {items.length === 0 ? (
        <div className="dashboard-card p-5 text-center">
          <p className="text-muted mb-0">Tidak ada warga.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((u) => (
            <div className="col-lg-6" key={u.nik}>
              <div
                className="dashboard-card p-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setDetail(u)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setDetail(u); }}
              >
                <div className="d-flex gap-3 align-items-start">
                  <div className="d-flex flex-column align-items-center flex-shrink-0 gap-2">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt="Foto profil"
                        className="rounded-circle"
                        style={{ width: 56, height: 56, objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                        style={{ width: 56, height: 56, backgroundColor: 'var(--color-brand)' }}
                      >{initials(u.name)}</span>
                    )}
                    {u.ktp && (
                      <button
                        type="button"
                        className="btn btn-outline-brand rounded p-0 overflow-hidden d-block"
                        style={{ width: 64, height: 48 }}
                        onClick={(e) => { e.stopPropagation(); setKtpView(u); }}
                        title="Lihat foto KTP"
                      >
                        <img
                          src={u.ktp}
                          alt="Foto KTP"
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </button>
                    )}
                    {!u.ktp && <small className="text-muted" style={{ fontSize: 10 }}>tanpa KTP</small>}
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="h5 mb-1">{u.name}</h3>
                    <small className="text-muted d-block">NIK {u.nik} · KK {u.kk || '-'}</small>
                    <small className="text-muted d-block">{u.email || 'tanpa email'} · WA {u.wa || '-'}</small>
                    <small className="text-muted d-block mt-1">{u.alamat || '-'}</small>
                    <small className="text-muted d-block">Daftar: {fmtTanggal(u.created_at)}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <StatusBadge status={u.status} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-top d-flex gap-2 flex-wrap">
                  {u.status === 'PENDING' ? (
                    <>
                      <button className="btn btn-sm btn-brand" onClick={(e) => { e.stopPropagation(); openReview(u, 'VERIFIED'); }}>
                        <AppIcon name="user-check" className="me-1" />Setujui
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); openReview(u, 'REJECTED'); }}>
                        <AppIcon name="user-x" className="me-1" />Tolak
                      </button>
                    </>
                  ) : (
                    u.status === 'REJECTED' ? (
                      <>
                        <span className="text-danger small align-self-center">Ditolak</span>
                        <button className="btn btn-sm btn-outline-brand ms-2" onClick={(e) => { e.stopPropagation(); openReview(u, 'VERIFIED'); }}>Setujui ulang</button>
                      </>
                    ) : (
                      <span className="text-muted small align-self-center"><AppIcon name="check2-circle" className="me-1" />Terverifikasi</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ktpView && (
        <div className="ktp-lightbox" onClick={() => setKtpView(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
              <div>
                <strong>{ktpView.name}</strong>
                <small className="d-block text-muted">NIK {ktpView.nik} · Foto identitas pendaftaran</small>
              </div>
              <button className="btn btn-sm btn-outline-brand flex-shrink-0" onClick={() => setKtpView(null)}>Tutup</button>
            </div>
            <div className="row g-3">
              <div className="col-4">
                <small className="text-muted d-block mb-1">Foto profil</small>
                {ktpView.avatar ? (
                  <img src={ktpView.avatar} alt="Foto profil" className="w-100 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ height: 160 }}>
                    <span className="text-muted small">Belum ada</span>
                  </div>
                )}
              </div>
              <div className="col-8">
                <small className="text-muted d-block mb-1">Foto KTP</small>
                {ktpView.ktp ? (
                  <img src={ktpView.ktp} alt={`Foto KTP ${ktpView.name}`} className="w-100 rounded" />
                ) : (
                  <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ height: 160 }}>
                    <span className="text-muted small">Tidak diunggah saat pendaftaran</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="ktp-lightbox" onClick={() => setDetail(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
              <div>
                <h3 className="h5 mb-1">{detail.name}</h3>
                <small className="text-muted d-block">NIK {detail.nik}</small>
              </div>
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <StatusBadge status={detail.status} />
                <button className="btn btn-sm btn-outline-brand" onClick={() => setDetail(null)}>Tutup</button>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <small className="text-muted d-block mb-1">Foto profil</small>
                {detail.avatar ? (
                  <img
                    src={detail.avatar}
                    alt="Foto profil"
                    className="w-100 rounded"
                    style={{ maxHeight: 260, objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ height: 180 }}>
                    <span className="text-muted small">Belum ada foto profil</span>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <small className="text-muted d-block mb-1">Foto KTP</small>
                {detail.ktp ? (
                  <img src={detail.ktp} alt={`Foto KTP ${detail.name}`} className="w-100 rounded" style={{ maxHeight: 260, objectFit: 'cover' }} />
                ) : (
                  <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ height: 180 }}>
                    <span className="text-muted small">Tidak diunggah saat pendaftaran</span>
                  </div>
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr><th scope="row" className="text-muted fw-normal">Nama</th><td>{detail.name}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">NIK</th><td>{detail.nik}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">KK</th><td>{detail.kk || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Email</th><td>{detail.email || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">WhatsApp</th><td>{detail.wa || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Alamat</th><td>{detail.alamat || '-'}</td></tr>
                  <tr><th scope="row" className="text-muted fw-normal">Tanggal daftar</th><td>{fmtTanggal(detail.created_at)}</td></tr>
                </tbody>
              </table>
            </div>

            {detail.status === 'PENDING' && (
              <div className="d-flex gap-2 mt-3 pt-3 border-top">
                <button className="btn btn-sm btn-brand" onClick={() => { setDetail(null); openReview(detail, 'VERIFIED'); }}>
                  <AppIcon name="user-check" className="me-1" />Setujui
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => { setDetail(null); openReview(detail, 'REJECTED'); }}>
                  <AppIcon name="user-x" className="me-1" />Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {review && (
        <div className="ktp-lightbox" onClick={() => !saving && setReview(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
              <div>
                <strong>{review.status === 'VERIFIED' ? 'Setujui' : 'Tolak'} — {review.u.name}</strong>
                <small className="d-block text-muted">NIK {review.u.nik} · {review.u.email || 'tanpa email'}</small>
              </div>
              <button className="btn btn-sm btn-outline-brand flex-shrink-0" disabled={saving} onClick={() => setReview(null)}>Batal</button>
            </div>
            <p className="small text-muted">
              {review.status === 'VERIFIED'
                ? 'Pastikan foto profil & KTP cocok dengan data NIK sebelum menyetujui.'
                : 'Jelaskan persyaratan yang kurang. Pesan ini dikirim sebagai notifikasi ke warga.'}
            </p>
            <label className="form-label fw-semibold" htmlFor="review-note">
              {review.status === 'VERIFIED' ? 'Catatan (opsional)' : 'Alasan / persyaratan kurang'}
            </label>
            <textarea
              id="review-note"
              rows="3"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={review.status === 'REJECTED' ? 'Contoh: foto KTP buram, NIK tidak terdaftar…' : 'Catatan bila perlu'}
            ></textarea>
            {err && <div className="mt-2"><AppAlert type="danger">{err}</AppAlert></div>}
            <button
              className={`btn ${review.status === 'VERIFIED' ? 'btn-brand' : 'btn-danger'} mt-3 w-100`}
              disabled={saving}
              onClick={() => setStatus(review.u.nik, review.status)}
            >
              {saving ? 'Menyimpan…' : review.status === 'VERIFIED' ? 'Setujui & Kirim Notifikasi' : 'Tolak & Kirim Notifikasi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}