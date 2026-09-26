import { useState } from 'react';
import { usePengumuman, addItem, updateItem, deleteItem, fmtDate } from '../../services/contentStore.js';
import { uploadDataUrl } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const images = [
  '/assets/placeholders/pengumuman-1.jpg',
  '/assets/placeholders/pengumuman-2.jpg',
];
const empty = { title: '', summary: '', image: images[0], content: '' };

export default function AdminPengumuman() {
  const items = usePengumuman();
  const [editing, setEditing] = useState(null);
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
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError('Judul, ringkasan, dan isi pengumuman wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      image: form.image,
      content: form.content.split('\n').map((s) => s.trim()).filter(Boolean),
      date: fmtDate(new Date()),
    };
    try {
      if (editing) await updateItem('pengumuman', editing.slug, payload);
      else await addItem('pengumuman', payload);
      reset();
      setSuccess(editing ? 'Pengumuman diperbarui.' : 'Pengumuman baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pengumuman.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({ title: it.title, summary: it.summary, image: it.image, content: it.content.join('\n') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus pengumuman "${it.title}"?`)) return;
    try {
      await deleteItem('pengumuman', it.slug);
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengumuman.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Pengumuman</h1>
        <p className="lead text-muted mb-0">Tambah, ubah, atau hapus pengumuman kelurahan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? 'Ubah Pengumuman' : 'Pengumuman Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-title">Judul</label>
                <input id="p-title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-img">Gambar</label>
                <select id="p-img" className="form-select" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}>
                  {images.map((i) => <option key={i} value={i}>{i.split('/').pop()}</option>)}
                  {!images.includes(form.image) && <option value={form.image}>File unggahan ({form.image.split('/').pop()})</option>}
                </select>
                <div className="mt-2">
                  <input id="p-img-file" type="file" accept="image/*" className="form-control" onChange={onImageFile} />
                  {form.image && <img src={form.image} className="upload-preview mt-2" alt="Pratinjau" style={{ maxHeight: 120 }} />}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-sum">Ringkasan</label>
                <textarea id="p-sum" rows="2" className="form-control" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-con">Isi (satu paragraf per baris)</label>
                <textarea id="p-con" rows="6" className="form-control" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{editing ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          {items.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada pengumuman.</p></div>
          ) : (
            <div className="row g-3">
              {items.map((it) => (
                <div className="col-md-6 d-flex" key={it.slug}>
                  <div className="dashboard-card p-3 w-100">
                    <div className="d-flex gap-3 align-items-start">
                      <img src={it.image} alt="" className="rounded" style={{ width: 96, height: 72, objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <small className="text-brand fw-semibold d-block">{it.date}</small>
                        <h3 className="h6 mt-1 mb-0">{it.title}</h3>
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