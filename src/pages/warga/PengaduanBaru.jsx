import { useEffect, useRef, useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { createComplaint, uploadDataUrl } from '../../services/store.js';
import AppAlert from '../../components/common/AppAlert.jsx';
import MultiFileUpload from '../../components/warga/MultiFileUpload.jsx';

const categories = ['Infrastruktur', 'Kebersihan', 'Lingkungan', 'Pelayanan', 'Keamanan', 'Lainnya'];

export default function PengaduanBaru() {
  const nav = useNavigate();
  const [form, setForm] = useState({ category: categories[0], title: '', description: '', rt: '', rw: '', gmaps_link: '', photos: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  /* The post-success redirect is delayed so the resident can read the confirmation.
     Hold the id so unmounting (sidebar click, browser Back) cancels it — otherwise
     the timer fires later and yanks them out of wherever they navigated to. */
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  /* Accepts a plain value or a functional updater — MultiFileUpload passes
     (prev) => next so rapid selections append instead of overwriting. */
  const update = (key, valueOrFn) =>
    setForm((f) => ({ ...f, [key]: typeof valueOrFn === 'function' ? valueOrFn(f[key]) : valueOrFn }));


  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError(''); setSuccess('');
    const rt = Number(form.rt);
    const rw = Number(form.rw);
    if (!form.title.trim() || !form.description.trim() || !Number.isInteger(rt) || rt < 1 || rt > 99 || !Number.isInteger(rw) || rw < 1 || rw > 99) {
      setError('Judul, deskripsi, RT, dan RW wajib diisi (RT/RW bernilai 1–99).');
      return;
    }
    setSending(true);
    try {
      const photos = await Promise.all(form.photos.map((p) => uploadDataUrl(p.dataUrl)));
      const complaint = await createComplaint({
        title: form.title,
        category: form.category,
        description: form.description,
        rt,
        rw,
        gmaps_link: form.gmaps_link.trim() || null,
        photos: photos.length ? photos : null,
      });
      setSuccess(`Pengaduan ${complaint.id_code} berhasil dikirim.${photos.length ? ` ${photos.length} foto terunggah.` : ''}`);
      setForm({ category: categories[0], title: '', description: '', rt: '', rw: '', gmaps_link: '', photos: [] });
      redirectTimer.current = setTimeout(() => nav('/warga/pengaduan'), 900);
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengaduan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Buat Pengaduan Baru</h1>
        <p className="lead text-muted">
          Sampaikan laporan terkait layanan atau lingkungan. Status pengaduan dapat
          dipantau dari halaman pengaduan.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="dashboard-card p-4">
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="category">Kategori</label>
                <select id="category" className="form-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="title">Judul laporan</label>
                <input id="title" className="form-control" placeholder="Contoh: Lampu jalan di RT 02 mati" value={form.title} onChange={(e) => update('title', e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="description">Deskripsi</label>
                <textarea id="description" rows="4" className="form-control" placeholder="Jelaskan masalah, sejak kapan, dan dampaknya" value={form.description} onChange={(e) => update('description', e.target.value)}></textarea>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" htmlFor="rt">RT</label>
                  <input id="rt" type="number" min="1" max="99" inputMode="numeric" className="form-control" placeholder="Contoh: 3" value={form.rt} onChange={(e) => update('rt', e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" htmlFor="rw">RW</label>
                  <input id="rw" type="number" min="1" max="99" inputMode="numeric" className="form-control" placeholder="Contoh: 5" value={form.rw} onChange={(e) => update('rw', e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="gmaps_link">Link lokasi Google Maps (opsional)</label>
                <input id="gmaps_link" type="url" className="form-control" placeholder="Tempel link lokasi kejadian dari Google Maps" value={form.gmaps_link} onChange={(e) => update('gmaps_link', e.target.value)} />
              </div>
              <div className="mb-3">
                <MultiFileUpload
                  id="photos"
                  label="Foto bukti (opsional, maks 5)"
                  accept="image/*"
                  imagesOnly
                  maxSize={500 * 1024}
                  maxFiles={5}
                  value={form.photos}
                  onChange={(photos) => update('photos', photos)}
                  onError={setError}
                />
                <small className="text-muted d-block mt-1">Gambar, masing-masing maksimal 500 KB. Bisa pilih beberapa sekaligus.</small>
              </div>

              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}

              <button className="btn btn-brand" type="submit" disabled={sending}>
                {sending ? 'Mengirim…' : 'Kirim Pengaduan'} <AppIcon name="send" className="ms-1" />
              </button>
              <Link to="/warga/pengaduan" className="btn btn-outline-brand ms-2">Batal</Link>
            </form>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="side-card">
            <div className="doc-icon mb-3"><AppIcon name="clipboard-check" /></div>
            <h2 className="h5">Alur setelah pengaduan dikirim</h2>
            <ol className="small text-muted mb-0 ps-3">
              <li>Diajukan — laporan masuk ke antrean.</li>
              <li>Sedang diproses — ditinjau petugas kelurahan.</li>
              <li>Selesai — laporan telah ditindaklanjuti.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}