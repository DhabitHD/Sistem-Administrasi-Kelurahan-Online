import { useEffect, useState } from 'react';
import { listOfficers, createOfficer, updateOfficer, deleteOfficer, uploadDataUrl } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const empty = { nama: '', wa: '', foto: '' };

const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

const waDigits = (wa) => {
  let d = (wa || '').replace(/\D/g, '');
  return d.startsWith('0') ? '62' + d.slice(1) : d;
};

export default function AdminPetugas() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = () => listOfficers().then(setItems).catch(() => setItems([]));
  useEffect(() => { refresh(); }, []);

  const onFoto = async (e, into) => {
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
        into(path);
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
    if (!form.nama.trim() || !form.wa.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await createOfficer({ nama: form.nama.trim(), wa: form.wa.trim(), foto: form.foto || null });
      setSuccess('Petugas lapangan berhasil ditambahkan.');
      setForm(empty);
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan petugas.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (it) => {
    setError(''); setSuccess('');
    setEditing({ id: it.id, nama: it.nama, wa: it.wa || '', foto: it.foto || '' });
  };

  const submitEdit = async () => {
    setError(''); setSuccess('');
    if (!editing.nama.trim() || !editing.wa.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await updateOfficer(editing.id, { nama: editing.nama.trim(), wa: editing.wa.trim(), foto: editing.foto || null });
      setSuccess('Data petugas diperbarui.');
      setEditing(null);
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui petugas.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus petugas "${it.nama}"? Pengaduan yang terkait akan kehilangan penugasan.`)) return;
    setError(''); setSuccess('');
    try {
      await deleteOfficer(it.id);
      setSuccess('Petugas dihapus.');
      refresh();
    } catch (err) {
      setError(err.message || 'Gagal menghapus petugas.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Petugas Lapangan</h1>
        <p className="lead text-muted mb-0">Kelola petugas yang ditugaskan menangani pengaduan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">Petugas Baru</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-nama">Nama</label>
                <input id="p-nama" className="form-control" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Ahmad Nurhidayat" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-wa">Nomor WhatsApp</label>
                <input id="p-wa" className="form-control" value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} placeholder="08123456789" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-foto">Foto Profil (opsional)</label>
                <input id="p-foto" type="file" accept="image/*" className="form-control" onChange={(e) => onFoto(e, (v) => setForm((f) => ({ ...f, foto: v })))} />
                {form.foto && <img src={form.foto} className="upload-preview mt-2" alt="Pratinjau foto petugas" />}
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Tambah Petugas'}</button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {items.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada petugas.</p></div>
          ) : (
            <div className="dashboard-card p-3" style={{ height: 'auto' }}>
              {items.map((it) => (
                <div className="d-flex align-items-center gap-3 py-3 border-bottom border-light" key={it.id}>
                  {it.foto ? (
                    <img src={it.foto} alt="" className="rounded-circle flex-shrink-0" style={{ width: 48, height: 48, objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: 'var(--color-brand)' }}>{initials(it.nama)}</span>
                  )}
                  <div className="flex-grow-1">
                    <strong className="d-block">{it.nama}</strong>
                    <small className="text-muted d-block">
                      {it.wa && <a href={`https://wa.me/${waDigits(it.wa)}`} target="_blank" rel="noreferrer" className="text-decoration-none">chat {it.wa}</a>}
                    </small>
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button className="btn btn-sm btn-outline-brand" onClick={() => openEdit(it)} title="Ubah"><AppIcon name="pencil" size={14} /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it)} title="Hapus"><AppIcon name="trash" size={14} /></button>
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
                <strong>Ubah Petugas</strong>
                <small className="d-block text-muted">Nomor WhatsApp dipakai untuk kirim detail pengaduan saat plotting.</small>
              </div>
              <button className="btn btn-sm btn-outline-brand flex-shrink-0" disabled={saving} onClick={() => setEditing(null)}>Batal</button>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="pe-nama">Nama</label>
              <input id="pe-nama" className="form-control" value={editing.nama} onChange={(e) => setEditing({ ...editing, nama: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="pe-wa">Nomor WhatsApp</label>
              <input id="pe-wa" className="form-control" value={editing.wa} onChange={(e) => setEditing({ ...editing, wa: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="pe-foto">Foto Profil (opsional)</label>
              <input id="pe-foto" type="file" accept="image/*" className="form-control" onChange={(e) => onFoto(e, (v) => setEditing((f) => ({ ...f, foto: v })))} />
              {editing.foto && <img src={editing.foto} className="upload-preview mt-2" alt="Pratinjau foto petugas" />}
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