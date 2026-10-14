import { useState } from 'react';
import { usePerangkat, addItem, updateItem, deleteItem } from '../../services/contentStore.js';
import { uploadDataUrl } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const empty = { role: '', name: '', order: 1, photo: '' };

export default function AdminPerangkat() {
  const items = usePerangkat();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setEditing(null); setForm(empty); setError(''); setSuccess(''); };

  const onPhoto = async (e) => {
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
        setForm((f) => ({ ...f, photo: path }));
      } catch (err) {
        setError(err.message || 'Gagal mengunggah gambar.');
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.role.trim() || !form.name.trim()) {
      setError('Jabatan dan nama wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      role: form.role.trim(),
      name: form.name.trim(),
      order: Number(form.order) || 0,
      photo: form.photo || null,
    };
    try {
      if (editing) await updateItem('perangkat', editing.slug, payload);
      else await addItem('perangkat', payload);
      reset();
      setSuccess(editing ? 'Perangkat diperbarui.' : 'Perangkat baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perangkat.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({ role: it.role, name: it.name, order: it.order ?? 0, photo: it.photo || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus "${it.name}"?`)) return;
    try {
      await deleteItem('perangkat', it.slug);
    } catch (err) {
      setError(err.message || 'Gagal menghapus perangkat.');
    }
  };

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Perangkat &amp; Struktur Organisasi</h1>
        <p className="lead text-muted mb-0">Tambah, ubah, atau hapus perangkat kelurahan beserta foto.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? 'Ubah Perangkat' : 'Perangkat Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="k-role">Jabatan</label>
                <input id="k-role" className="form-control" list="perangkat-roles" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <datalist id="perangkat-roles">
                  {['Lurah', 'Sekretaris Kelurahan', 'Seksi Pemerintahan dan Pelayanan Umum', 'Seksi Trantib Umum dan Kesejahteraan Masyarakat', 'Seksi Ekbang dan Pemberdayaan Masyarakat', 'Staf'].map((r) => <option key={r} value={r} />)}
                </datalist>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="k-name">Nama</label>
                <input id="k-name" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-auto">
                  <label className="form-label fw-semibold" htmlFor="k-order">Urutan</label>
                  <input id="k-order" type="number" min="0" className="form-control" style={{ width: 90 }} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                </div>
                <div className="col">
                  <label className="form-label fw-semibold" htmlFor="k-photo">Foto (opsional)</label>
                  <input id="k-photo" type="file" accept="image/*" className="form-control" onChange={onPhoto} />
                </div>
              </div>
              {form.photo && <img src={form.photo} className="upload-preview mb-3" alt="Pratinjau foto" style={{ maxHeight: 120 }} />}
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : editing ? 'Simpan Perubahan' : 'Tambahkan Perangkat'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {sorted.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada perangkat kelurahan.</p></div>
          ) : (
            <div className="row g-3">
              {sorted.map((it) => (
                <div className="col-md-6 d-flex" key={it.slug}>
                  <div className="dashboard-card p-3 w-100">
                    <div className="d-flex gap-3 align-items-start">
                      {it.photo ? (
                        <img src={it.photo} alt="" className="rounded-circle flex-shrink-0" style={{ width: 56, height: 56, objectFit: 'cover' }} />
                      ) : (
                        <span className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 56, height: 56, backgroundColor: 'var(--color-brand)' }}>{initials(it.name)}</span>
                      )}
                      <div className="flex-grow-1">
                        <small className="text-brand fw-semibold d-block">#{it.order ?? 0} · {it.role}</small>
                        <h3 className="h6 mt-1 mb-0">{it.name}</h3>
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