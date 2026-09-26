import { useEffect, useState } from 'react';
import { addSlide, updateSlide, deleteSlide } from '../../services/contentStore.js';
import { api } from '../../services/api.js';
import { uploadDataUrl } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const presets = [
  '/assets/placeholders/hero-banner.jpg',
  '/assets/placeholders/struktur-pemerintahan.jpg',
  '/assets/placeholders/foto-lurah.jpg',
  '/assets/placeholders/layanan-1.jpg',
  '/assets/placeholders/berita-1.jpg',
];
const empty = { image: presets[0], kicker: '', title_before: '', title_span: '', lead: '', order: 1, is_active: true };

export default function AdminHero() {
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api
      .get('/admin/hero')
      .then(setSlides)
      .catch(() => setSlides([]));
  }, []);

  const refresh = () => api.get('/admin/hero').then(setSlides).catch(() => {});
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setEditing(null); setForm(empty); setError(''); setSuccess(''); };

  const onImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      e.target.value = '';
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const path = await uploadDataUrl(reader.result);
        setForm((f) => ({ ...f, image: path }));
      } catch (err) {
        setError(err.message || 'Gagal mengunggah gambar.');
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.image.trim()) {
      setError('Gambar slide wajib dipilih.');
      return;
    }
    setSaving(true);
    const payload = {
      image: form.image,
      kicker: form.kicker,
      title_before: form.title_before,
      title_span: form.title_span,
      lead: form.lead,
      order: Number(form.order) || 0,
      is_active: !!form.is_active,
    };
    try {
      if (editing) await updateSlide(editing.id, payload);
      else await addSlide(payload);
      await refresh();
      reset();
      setSuccess(editing ? 'Slide diperbarui.' : 'Slide baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan slide.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({
      image: it.image,
      kicker: it.kicker || '',
      title_before: it.title_before || '',
      title_span: it.title_span || '',
      lead: it.lead || '',
      order: it.order,
      is_active: !!it.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus slide "${it.kicker || 'tanpa judul'}"?`)) return;
    try {
      await deleteSlide(it.id);
      await refresh();
    } catch (err) {
      setError(err.message || 'Gagal menghapus slide.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Slide Halaman Utama</h1>
        <p className="lead text-muted mb-0">Kelola gambar dan teks carousel hero pada beranda.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? `Ubah Slide #${editing.order}` : 'Slide Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="h-img">Gambar</label>
                <select id="h-img" className="form-select" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}>
                  {presets.map((i) => <option key={i} value={i}>{i.split('/').pop()}</option>)}
                  {!presets.includes(form.image) && <option value={form.image}>File unggahan ({form.image.split('/').pop()})</option>}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="h-img-file">Atau unggah gambar</label>
                <input id="h-img-file" type="file" accept="image/*" className="form-control" onChange={onImageFile} />
                {form.image && <img src={form.image} className="upload-preview mt-3" alt="Preview slide" style={{ maxHeight: 140 }} />}
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="h-kicker">Kicker (label kecil)</label>
                  <input id="h-kicker" className="form-control" maxLength={120} value={form.kicker} onChange={(e) => setForm({ ...form, kicker: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="h-span">Span judul (kata ditekankan)</label>
                  <input id="h-span" className="form-control" maxLength={80} value={form.title_span} onChange={(e) => setForm({ ...form, title_span: e.target.value })} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="h-before">Judul (kalimat sebelum span)</label>
                <input id="h-before" className="form-control" maxLength={160} value={form.title_before} onChange={(e) => setForm({ ...form, title_before: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="h-lead">Deskripsi</label>
                <textarea id="h-lead" rows="3" className="form-control" maxLength={500} value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })}></textarea>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-auto">
                  <label className="form-label fw-semibold d-block" htmlFor="h-order">Urutan</label>
                  <input id="h-order" type="number" min="1" className="form-control" style={{ width: 90 }} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                </div>
                <div className="col-auto d-flex align-items-end pb-1">
                  <div className="form-check form-switch mb-0">
                    <input id="h-active" className="form-check-input" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label className="form-check-label" htmlFor="h-active">Slide aktif</label>
                  </div>
                </div>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambah Slide'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          {slides.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada slide. Beranda akan memakai slide bawaan.</p></div>
          ) : (
            <div className="row g-3">
              {[...slides].sort((a, b) => (a.order || 0) - (b.order || 0)).map((it) => (
                <div className="col-12 d-flex" key={it.id}>
                  <div className="dashboard-card p-3 w-100">
                    <div className="d-flex gap-3 align-items-start">
                      <img src={it.image} alt="" className="rounded" style={{ width: 120, height: 76, objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <small className="text-brand fw-semibold d-block">#{it.order} {it.is_active ? '' : '· nonaktif'}</small>
                        <h3 className="h6 mt-1 mb-0">{it.kicker || (it.title_before + it.title_span) || 'Tanpa judul'}</h3>
                        {!it.is_active && <small className="text-danger">Slide dimatikan, tak tampil di beranda.</small>}
                      </div>
                      <div className="d-flex gap-1 flex-shrink-0">
                        <button className="btn btn-sm btn-outline-brand" onClick={() => startEdit(it)} title="Ubah">
                          <AppIcon name="pencil" size={15} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it)} title="Hapus">
                          <AppIcon name="trash" size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}