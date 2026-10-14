import { useEffect, useState } from 'react';
import { addItem, updateItem, deleteItem } from '../../services/contentStore.js';
import { api, uploadFile } from '../../services/api.js';
import { isYoutube, embedFromUrl } from '../../services/video.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const empty = { title: '', video: '', desc: '', is_active: true, order: 1 };

export default function AdminVideo() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .get('/admin/video')
      .then((d) => { setItems(d); setLoadError(''); })
      .catch((e) => { setItems([]); setLoadError(`Data video gagal dimuat: ${e.message || 'periksa koneksi'}`); });
  }, []);

  const refresh = () =>
    api
      .get('/admin/video')
      .then((d) => { setItems(d); setLoadError(''); })
      .catch((e) => { setItems([]); setLoadError(`Data video gagal dimuat: ${e.message || 'periksa koneksi'}`); });
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
      setForm((f) => ({ ...f, video: path }));
    } catch (err) {
      setError(err.message || 'Gagal mengunggah video.');
      e.target.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim() || !form.video.trim()) {
      setError('Judul dan tautan video wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      video: form.video.trim(),
      desc: form.desc.trim() || null,
      is_active: !!form.is_active,
      order: Number(form.order) || 0,
    };
    try {
      if (editing) await updateItem('video', editing.slug, payload);
      else await addItem('video', payload);
      await refresh();
      reset();
      setSuccess(editing ? 'Video diperbarui.' : 'Video baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan video.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({ title: it.title, video: it.video, desc: it.desc || '', is_active: !!it.is_active, order: it.order ?? 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus video "${it.title}"?`)) return;
    try {
      await deleteItem('video', it.slug);
      await refresh();
    } catch (err) {
      setError(err.message || 'Gagal menghapus video.');
    }
  };

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Video</h1>
        <p className="lead text-muted mb-0">Tambah, ubah, atau hapus video yang tampil di halaman utama.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? 'Ubah Video' : 'Video Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="v-title">Judul</label>
                <input id="v-title" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="v-url">Tautan video</label>
                <input id="v-url" className="form-control" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="https://www.youtube.com/watch?v=… atau hasil unggah di bawah" />
                <small className="text-muted d-block mt-1">YouTube URL otomatis jadi embed; URL mp4 langsung diputar.</small>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="v-file">Atau unggah video (mp4/webm, maks 50 MB)</label>
                <input id="v-file" type="file" accept="video/*" className="form-control" onChange={onFile} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="v-desc">Deskripsi (opsional)</label>
                <textarea id="v-desc" rows="2" className="form-control" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}></textarea>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-auto">
                  <label className="form-label fw-semibold" htmlFor="v-order">Urutan</label>
                  <input id="v-order" type="number" min="0" className="form-control" style={{ width: 90 }} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                </div>
                <div className="col-auto d-flex align-items-end pb-1">
                  <div className="form-check form-switch mb-0">
                    <input id="v-active" className="form-check-input" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label className="form-check-label" htmlFor="v-active">Tampil di beranda</label>
                  </div>
                </div>
              </div>
              {form.video && (
                <div className="mb-3">
                  {isYoutube(form.video) ? (
                    <iframe
                      title="Pratinjau video"
                      src={embedFromUrl(form.video)}
                      className="w-100 rounded"
                      style={{ aspectRatio: '16 / 9' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video src={form.video} controls className="w-100 rounded" style={{ maxHeight: 200 }}></video>
                  )}
                </div>
              )}
              {loadError && <AppAlert type="danger">{loadError}</AppAlert>}
          {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambah Video'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {sorted.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">{loadError ? 'Data tidak dapat ditampilkan.' : 'Belum ada video.'}</p></div>
          ) : (
            <div className="row g-3">
              {sorted.map((it) => (
                <div className="col-md-6 d-flex" key={it.slug}>
                  <div className="dashboard-card p-3 w-100">
                    {isYoutube(it.video) ? (
                      <iframe
                        title={it.title}
                        src={embedFromUrl(it.video)}
                        className="w-100 rounded"
                        style={{ aspectRatio: '16 / 9' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video src={it.video} controls className="w-100 rounded" style={{ aspectRatio: '16 / 9' }}></video>
                    )}
                    <div className="d-flex gap-3 align-items-start mt-2">
                      <div className="flex-grow-1">
                        <small className="text-brand fw-semibold d-block">
                          #{it.order ?? 0} · {it.is_active ? 'Aktif' : 'Nonaktif'}
                        </small>
                        <h3 className="h6 mt-1 mb-0">{it.title}</h3>
                        {it.desc && <small className="text-muted d-block mt-1">{it.desc}</small>}
                      </div>
                      <div className="d-flex gap-1 flex-shrink-0">
                        <button type="button" aria-label="Ubah" title="Ubah" className="btn btn-sm btn-outline-brand" onClick={() => startEdit(it)} >
                          <AppIcon name="pencil" size={15} />
                        </button>
                        <button type="button" aria-label="Hapus" title="Hapus" className="btn btn-sm btn-outline-danger" onClick={() => remove(it)} >
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