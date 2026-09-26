import { useEffect, useState } from 'react';
import { useProfil, updateProfil } from '../../services/contentStore.js';
import { uploadDataUrl } from '../../services/store.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const fallback = { nama_lurah: '', foto_lurah: '', struktur_image: '', struktur_desc: '', visi: '', misi: '', sambutan: '', kontak_alamat: '', kontak_telp: '', kontak_email: '', kontak_jam: '' };

export default function AdminProfil() {
  const profil = useProfil();
  const [form, setForm] = useState(fallback);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profil && profil.visi !== undefined) {
      setForm({
        nama_lurah: profil.nama_lurah || '',
        foto_lurah: profil.foto_lurah || '',
        struktur_image: profil.struktur_image || '',
        struktur_desc: profil.struktur_desc || '',
        visi: profil.visi || '',
        misi: Array.isArray(profil.misi) ? profil.misi.join('\n') : (profil.misi || ''),
        sambutan: Array.isArray(profil.sambutan) ? profil.sambutan.join('\n') : (profil.sambutan || ''),
        kontak_alamat: profil.kontak_alamat || '',
        kontak_telp: profil.kontak_telp || '',
        kontak_email: profil.kontak_email || '',
        kontak_jam: profil.kontak_jam || '',
      });
    }
  }, [profil]);

  const onImage = (field) => async (e) => {
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
        setForm((f) => ({ ...f, [field]: path }));
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
    setSaving(true);
    const misiArr = form.misi.split('\n').map((s) => s.trim()).filter(Boolean);
    const sambutanArr = form.sambutan.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = {
      nama_lurah: form.nama_lurah.trim(),
      foto_lurah: form.foto_lurah || null,
      struktur_image: form.struktur_image || null,
      struktur_desc: form.struktur_desc.trim(),
      visi: form.visi.trim(),
      misi: misiArr.length ? misiArr : null,
      sambutan: sambutanArr.length ? sambutanArr : null,
      kontak_alamat: form.kontak_alamat.trim() || null,
      kontak_telp: form.kontak_telp.trim() || null,
      kontak_email: form.kontak_email.trim() || null,
      kontak_jam: form.kontak_jam.trim() || null,
    };
    try {
      await updateProfil(payload);
      setSuccess('Profil kelurahan diperbarui.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <span className="eyebrow text-brand">PORTAL ADMIN</span>
        <h1 className="h2 mt-2">Kelola Profil Kelurahan</h1>
        <p className="lead text-muted mb-0">Perbarui foto lurah, visi &amp; misi, dan gambar struktur pemerintahan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">Data Profil</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-nama">Nama Lurah</label>
                <input id="p-nama" className="form-control" value={form.nama_lurah} onChange={(e) => setForm({ ...form, nama_lurah: e.target.value })} />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-foto">Foto Lurah</label>
                  <input id="p-foto" type="file" accept="image/*" className="form-control" onChange={onImage('foto_lurah')} />
                  {form.foto_lurah && <img src={form.foto_lurah} className="upload-preview mt-2" alt="Foto lurah" style={{ maxHeight: 160 }} />}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-struktur">Gambar Struktur Pemerintahan</label>
                  <input id="p-struktur" type="file" accept="image/*" className="form-control" onChange={onImage('struktur_image')} />
                  {form.struktur_image && <img src={form.struktur_image} className="upload-preview mt-2" alt="Struktur pemerintahan" style={{ maxHeight: 160 }} />}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-sdesc">Deskripsi Struktur Organisasi</label>
                <textarea id="p-sdesc" rows="3" className="form-control" value={form.struktur_desc} onChange={(e) => setForm({ ...form, struktur_desc: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-visi">Visi</label>
                <textarea id="p-visi" rows="3" className="form-control" value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-misi">Misi (satu butir per baris)</label>
                <textarea id="p-misi" rows="5" className="form-control" value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="p-sambutan">Sambutan Lurah (satu paragraf per baris)</label>
                <textarea id="p-sambutan" rows="4" className="form-control" value={form.sambutan} onChange={(e) => setForm({ ...form, sambutan: e.target.value })}></textarea>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-ca">Kontak — Alamat</label>
                  <input id="p-ca" className="form-control" value={form.kontak_alamat} onChange={(e) => setForm({ ...form, kontak_alamat: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-ct">Kontak — Telepon</label>
                  <input id="p-ct" className="form-control" value={form.kontak_telp} onChange={(e) => setForm({ ...form, kontak_telp: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-ce">Kontak — Email</label>
                  <input id="p-ce" type="email" className="form-control" value={form.kontak_email} onChange={(e) => setForm({ ...form, kontak_email: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="p-cj">Kontak — Jam Pelayanan</label>
                  <input id="p-cj" className="form-control" value={form.kontak_jam} onChange={(e) => setForm({ ...form, kontak_jam: e.target.value })} />
                </div>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <button className="btn btn-brand" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Profil'}</button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">Pratinjau</h2>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={form.foto_lurah || '/assets/placeholders/foto-lurah.jpg'} alt="Lurah" className="rounded" style={{ width: 110, height: 110, objectFit: 'cover' }} />
              <div>
                <strong className="d-block">{form.nama_lurah || 'Nama Lurah'}</strong>
                <small className="text-muted">Lurah Betet</small>
              </div>
            </div>
            <small className="text-brand fw-bold d-block mb-1"><AppIcon name="landmark" size={14} className="me-1" />VISI</small>
            <p className="small">{form.visi || '—'}</p>
            <small className="text-brand fw-bold d-block mt-3 mb-1"><AppIcon name="check-circle" size={14} className="me-1" />MISI</small>
            {form.misi.split('\n').filter(Boolean).length > 0 ? (
              <ul className="small mb-0">
                {form.misi.split('\n').filter(Boolean).map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            ) : (
              <p className="small">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}