import { useEffect, useState } from 'react';
import { listAdmins, createAdmin, updateAdmin, deleteAdmin, uploadDataUrl } from '../../services/store.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const empty = { nama: '', email: '', password: '', confirm: '', wa: '', avatar: '' };
const editEmpty = { id: null, nama: '', wa: '', password: '', confirm: '', avatar: '' };

const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

export default function AdminAdmins() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const refresh = () => listAdmins().then(setItems).catch(() => setItems([]));
  useEffect(() => { refresh(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.nama.trim() || !form.email.trim() || !form.password) {
      setError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password harus sama.');
      return;
    }
    setSaving(true);
    try {
      await createAdmin({
        nama: form.nama.trim(),
        email: form.email.trim(),
        password: form.password,
        wa: form.wa.trim() || null,
        avatar: form.avatar || null,
      });
      setSuccess('Admin baru berhasil ditambahkan.');
      setForm(empty);
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan admin.');
    } finally {
      setSaving(false);
    }
  };

  const onCreateAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const path = await uploadDataUrl(reader.result);
        setForm((f) => ({ ...f, avatar: path }));
      } catch (err) {
        setError(err.message || 'Gagal mengunggah gambar.');
      }
    };
    reader.readAsDataURL(file);
  };

  const onEditAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const path = await uploadDataUrl(reader.result);
        setEditing((f) => ({ ...f, avatar: path }));
      } catch (err) {
        setError(err.message || 'Gagal mengunggah gambar.');
      }
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (it) => {
    setError(''); setSuccess('');
    setEditing({ id: it.id, nama: it.name, wa: it.wa || '', password: '', confirm: '', avatar: it.avatar || '' });
  };

  const submitEdit = async () => {
    setError(''); setSuccess('');
    if (!editing.nama.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    if (editing.password && editing.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (editing.password !== editing.confirm) {
      setError('Konfirmasi password harus sama.');
      return;
    }
    setSaving(true);
    try {
      await updateAdmin(editing.id, {
        nama: editing.nama.trim(),
        wa: editing.wa.trim() || null,
        avatar: editing.avatar || null,
        password: editing.password || undefined,
      });
      setSuccess('Data admin diperbarui.');
      setEditing(null);
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui admin.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it) => {
    if (it.id === user?.id) {
      setError('Tidak bisa menghapus akun admin sendiri.');
      return;
    }
    if (!window.confirm(`Hapus admin "${it.name}"?`)) return;
    setError(''); setSuccess('');
    try {
      await deleteAdmin(it.id);
      setSuccess('Admin dihapus.');
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal menghapus admin.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Admin</h1>
        <p className="lead text-muted mb-0">Tambah atau hapus akun admin kelurahan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">Admin Baru</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="a-nama">Nama</label>
                <input id="a-nama" className="form-control" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="a-email">Email</label>
                <input id="a-email" type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@betet.id" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="a-wa">WhatsApp (opsional)</label>
                <input id="a-wa" className="form-control" value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} placeholder="08123456789" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="a-avatar">Foto Profil (opsional)</label>
                <input id="a-avatar" type="file" accept="image/*" className="form-control" onChange={onCreateAvatar} />
                {form.avatar && <img src={form.avatar} className="upload-preview mt-2" alt="Pratinjau foto profil" />}
              </div>
              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label fw-semibold" htmlFor="a-pass">Password</label>
                  <input id="a-pass" type="password" autoComplete="new-password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="col">
                  <label className="form-label fw-semibold" htmlFor="a-confirm">Konfirmasi</label>
                  <input id="a-confirm" type="password" autoComplete="new-password" className="form-control" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
                </div>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Tambah Admin'}</button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {items.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada admin.</p></div>
          ) : (
            <div className="dashboard-card p-3" style={{ height: 'auto' }}>
              {items.map((it) => (
                <div className="d-flex align-items-center gap-3 py-3 border-bottom border-light" key={it.id}>
                  {it.avatar ? (
                    <img src={it.avatar} alt="" className="rounded-circle flex-shrink-0" style={{ width: 48, height: 48, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: 'var(--color-brand)' }}>{initials(it.name)}</span>
                  )}
                  <div className="flex-grow-1">
                    <strong className="d-block">{it.name}{it.id === user?.id && <small className="text-brand ms-2">(Anda)</small>}</strong>
                    <small className="text-muted d-block">{it.email} {it.wa ? `· WA ${it.wa}` : ''}</small>
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button className="btn btn-sm btn-outline-brand" onClick={() => openEdit(it)} title="Ubah">
                      <AppIcon name="pencil" size={14} />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it)} disabled={it.id === user?.id}>
                      <AppIcon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="ktp-lightbox" onClick={() => !saving && setEditing(null)} role="presentation">
          <div className="ktp-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
              <div>
                <strong>Ubah Admin</strong>
                <small className="d-block text-muted">Email tidak bisa diubah.</small>
              </div>
              <button className="btn btn-sm btn-outline-brand flex-shrink-0" disabled={saving} onClick={() => setEditing(null)}>Batal</button>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="e-nama">Nama</label>
              <input id="e-nama" className="form-control" value={editing.nama} onChange={(e) => setEditing({ ...editing, nama: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="e-wa">WhatsApp (opsional)</label>
              <input id="e-wa" className="form-control" value={editing.wa} onChange={(e) => setEditing({ ...editing, wa: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="e-avatar">Foto Profil (opsional)</label>
              <input id="e-avatar" type="file" accept="image/*" className="form-control" onChange={onEditAvatar} />
              {editing.avatar && <img src={editing.avatar} className="upload-preview mt-2" alt="Pratinjau foto profil" />}
            </div>
            <div className="row g-3 mb-3">
              <div className="col">
                <label className="form-label fw-semibold" htmlFor="e-pass">Password baru (opsional)</label>
                <input id="e-pass" type="password" autoComplete="new-password" className="form-control" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
              </div>
              <div className="col">
                <label className="form-label fw-semibold" htmlFor="e-confirm">Konfirmasi</label>
                <input id="e-confirm" type="password" autoComplete="new-password" className="form-control" value={editing.confirm} onChange={(e) => setEditing({ ...editing, confirm: e.target.value })} />
              </div>
            </div>
            {error && <div className="mb-2"><AppAlert type="danger">{error}</AppAlert></div>}
            <button className="btn btn-brand w-100" type="button" disabled={saving} onClick={submitEdit}>
              {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}