import { useState } from 'react';
import { useDokumen, addItem, updateItem, deleteItem, fmtDate } from '../../services/contentStore.js';
import { uploadFile } from '../../services/api.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const categories = ['DOKUMEN', 'INFORMASI'];
const icons = ['file-earmark-text', 'file-text', 'map', 'people', 'grid-3x3-gap', 'megaphone', 'landmark', 'info-circle'];
const empty = { title: '', category: 'DOKUMEN', desc: '', icon: icons[0], file: '', content: '' };

export default function AdminDokumen() {
  const items = useDokumen();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setEditing(null); setForm(empty); setError(''); setSuccess(''); };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const path = await uploadFile(file);
      setForm((f) => ({ ...f, file: path }));
    } catch (err) {
      setError(err.message || 'Gagal mengunggah file.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim() || !form.desc.trim()) {
      setError('Judul dan deskripsi wajib diisi.');
      return;
    }
    setSaving(true);
    const contentArr = form.content.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      desc: form.desc.trim(),
      icon: form.icon,
      file: form.file || null,
      content: contentArr.length ? contentArr : null,
      date: fmtDate(new Date()),
    };
    try {
      if (editing) await updateItem('dokumen', editing.slug, payload);
      else await addItem('dokumen', payload);
      reset();
      setSuccess(editing ? 'Dokumen diperbarui.' : 'Dokumen baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan dokumen.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({
      title: it.title,
      category: it.category || 'DOKUMEN',
      desc: it.desc,
      icon: it.icon || icons[0],
      file: it.file || '',
      content: Array.isArray(it.content) ? it.content.join('\n') : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus "${it.title}"?`)) return;
    try {
      await deleteItem('dokumen', it.slug);
    } catch (err) {
      setError(err.message || 'Gagal menghapus dokumen.');
    }
  };

  const fmt = (s) => (s || '—').replace(/^[A-Z]+$/, (k) => k[0] + k.slice(1).toLowerCase());

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Dokumen &amp; Informasi Publik</h1>
        <p className="lead text-muted mb-0">Tambah, ubah, atau hapus dokumen dan informasi publik yang tampil di halaman /dokumen.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? 'Ubah Item' : 'Item Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="d-title">Judul</label>
                <input id="d-title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="d-cat">Kategori</label>
                  <select id="d-cat" className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((c) => <option key={c} value={c}>{c[0] + c.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="d-icon">Ikon</label>
                  <select id="d-icon" className="form-select" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                    {icons.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="d-desc">Deskripsi</label>
                <textarea id="d-desc" rows="2" className="form-control" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="d-file">File dokumen (PDF/Word, opsional)</label>
                <input id="d-file" type="file" accept=".pdf,.doc,.docx,image/*" className="form-control" onChange={onFile} />
                {form.file && (
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <a href={form.file} target="_blank" rel="noreferrer"><AppIcon name="file-text" size={16} /> {form.file.split('/').pop()}</a>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="d-con">Isi informasi (opsional, satu paragraf per baris)</label>
                <textarea id="d-con" rows="5" className="form-control" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambahkan Item'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          {items.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada dokumen atau informasi publik.</p></div>
          ) : (
            <div className="row g-3">
              {items.map((it) => (
                <div className="col-md-6 d-flex" key={it.slug}>
                  <div className="dashboard-card p-3 w-100">
                    <div className="d-flex gap-3 align-items-start">
                      <div className="doc-icon flex-shrink-0"><AppIcon name={it.icon || 'file-earmark-text'} size={18} /></div>
                      <div className="flex-grow-1">
                        <small className="text-brand fw-semibold d-block">{fmt(it.category)} · {it.date}</small>
                        <h3 className="h6 mt-1 mb-0">{it.title}</h3>
                        {it.file && <small className="text-muted d-block mt-1">File: {it.file.split('/').pop()}</small>}
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