import { useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateProfile, uploadDataUrl } from '../../services/store.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AppAlert from '../../components/common/AppAlert.jsx';

const avatarInitial = (name) => name.trim().split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function WargaProfil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ wa: user.wa || '', email: user.email || '', alamat: user.alamat || '' });
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File foto harus berupa gambar.');
      e.target.value = '';
      return;
    }
    if (file.size > 500 * 1024) {
      setError('Ukuran foto maksimal 500 KB. Pilih foto yang lebih kecil.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!/^\d{9,15}$/.test(form.wa)) {
      setError('Nomor WhatsApp tidak valid. Gunakan angka tanpa spasi.');
      return;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Format email tidak valid.');
      return;
    }
    if (!form.alamat.trim()) {
      setError('Alamat wajib diisi.');
      return;
    }
    try {
      const avatarPath = avatar && avatar.startsWith('data:') ? await uploadDataUrl(avatar) : avatar;
      const updated = await updateProfile({ ...form, avatar: avatarPath });
      updateUser(updated);
      setSuccess('Data kontak berhasil diperbarui.');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui profil.');
    }
  };

  const rows = [
    ['Nama Lengkap', user.name],
    ['NIK', user.nik],
    ['Nomor KK', user.kk],
    ['Status Akun', user.status],
    ['Terdaftar Sejak', user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : user.createdAt],
  ];

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Profil Saya</h1>
        <p className="lead text-muted">Data identitas dan kontak terdaftar pada kelurahan.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="dashboard-card p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="position-relative">
                <span className="profile-avatar">{avatar ? <img src={avatar} alt="Foto profil" /> : avatarInitial(user.name)}</span>
                <label className="profile-avatar-edit" title="Ganti foto profil">
                  <AppIcon name="camera" size={14} />
                  <input type="file" accept="image/*" className="d-none" onChange={onAvatar} aria-label="Ganti foto profil" />
                </label>
              </div>
              <div>
                <h2 className="h5 mb-0">{user.name}</h2>
                <StatusBadge status={user.status} />
              </div>
            </div>
            {rows.map(([label, value]) => (
              <div className="d-flex justify-content-between py-2 border-bottom border-light" key={label}>
                <small className="text-muted">{label}</small>
                <strong className="text-end">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="dashboard-card p-4">
            <h2 className="h5 mb-3">Data kontak</h2>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="wa">Nomor WhatsApp</label>
                <input id="wa" inputMode="numeric" className="form-control" value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="email">Email</label>
                <input id="email" type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="alamat">Alamat</label>
                <textarea id="alamat" rows="3" className="form-control" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })}></textarea>
              </div>
              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}
              <button className="btn btn-brand" type="submit">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}