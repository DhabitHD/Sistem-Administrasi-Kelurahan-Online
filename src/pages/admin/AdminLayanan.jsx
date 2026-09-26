import { useState } from 'react';
import { useLayanan, addItem, updateItem, deleteItem } from '../../services/contentStore.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const iconOptions = ['person-vcard', 'file-earmark-medical', 'balloon', 'person-heart', 'credit-card-2-front', 'shop', 'house-door', 'hand-thumbs-up', 'file-text', 'users', 'map', 'megaphone'];
const empty = { name: '', icon: 'file-text', short: '', requirements: '', process: '' };

export default function AdminLayanan() {
  const items = useLayanan();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => { setEditing(null); setForm(empty); setError(''); setSuccess(''); };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim() || !form.short.trim()) {
      setError('Nama dan deskripsi singkat layanan wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      icon: form.icon,
      short: form.short.trim(),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      process: form.process.trim(),
    };
    try {
      if (editing) await updateItem('layanan', editing.slug, payload);
      else await addItem('layanan', payload);
      reset();
      setSuccess(editing ? 'Layanan diperbarui.' : 'Layanan baru ditambahkan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan layanan.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it) => {
    setEditing(it);
    setForm({ name: it.name, icon: it.icon, short: it.short, requirements: (it.requirements || []).join('\n'), process: it.process });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (it) => {
    if (!window.confirm(`Hapus layanan "${it.name}"?`)) return;
    try {
      await deleteItem('layanan', it.slug);
    } catch (err) {
      setError(err.message || 'Gagal menghapus layanan.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Layanan</h1>
        <p className="lead text-muted mb-0">Tambah, ubah, atau hapus layanan kelurahan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">{editing ? 'Ubah Layanan' : 'Layanan Baru'}</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="l-name">Nama layanan</label>
                <input id="l-name" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label fw-semibold" htmlFor="l-icon">Ikon</label>
                  <select id="l-icon" className="form-select" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                    {/* The seeder uses icons ('cross', 'baby', 'id-card', 'scan-text',
                        'store', 'map-pin-house') that are not in iconOptions. Without
                        this fallback the select rendered blank for those rows, and
                        saving would silently overwrite the icon. Matches the pattern
                        already used by AdminPengumuman:108 and AdminHero:134. */}
                    {!iconOptions.includes(form.icon) && (
                      <option value={form.icon}>{form.icon} (ikon tidak dikenal)</option>
                    )}
                    {iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="l-short">Deskripsi singkat</label>
                <textarea id="l-short" rows="2" className="form-control" value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="l-req">Persyaratan (satu per baris)</label>
                <textarea id="l-req" rows="4" className="form-control" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="l-proc">Proses</label>
                <textarea id="l-proc" rows="3" className="form-control" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })}></textarea>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <div className="d-flex gap-2">
                <button className="btn btn-brand" type="submit" disabled={saving}>{editing ? 'Simpan Perubahan' : 'Tambah Layanan'}</button>
                {editing && <button type="button" className="btn btn-outline-brand" onClick={reset}>Batal</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          {items.length === 0 ? (
            <div className="dashboard-card p-5 text-center"><p className="text-muted mb-0">Belum ada layanan.</p></div>
          ) : (
            <div className="row g-3">
              {items.map((it) => (
                <div className="col-md-6 d-flex" key={it.slug}>
                  <div className="dashboard-card p-3 w-100 d-flex flex-column">
                    <div className="d-flex gap-3 align-items-start">
                      <div className="service-icon flex-shrink-0"><AppIcon name={it.icon} size={20} /></div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <h3 className="h6 mb-1">{it.name}</h3>
                        <small className="text-muted d-block">{it.short}</small>
                      </div>
                    </div>
                    {/* Own row: inline, these buttons squeezed the title into ~135px
                        and sat in the top-right corner. Matches AdminPengaduan. */}
                    <div className="mt-3 pt-3 border-top d-flex gap-2 justify-content-end flex-shrink-0">
                      <button type="button" aria-label="Ubah" title="Ubah" className="btn btn-sm btn-outline-brand" onClick={() => startEdit(it)}>
                        <AppIcon name="pencil" size={15} />
                      </button>
                      <button type="button" aria-label="Hapus" title="Hapus" className="btn btn-sm btn-outline-danger" onClick={() => remove(it)}>
                        <AppIcon name="trash" size={15} />
                      </button>
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