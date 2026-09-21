import { useState } from 'react';
import AppIcon from '../common/AppIcon.jsx';
import { useNavigate } from 'react-router-dom';
import AppAlert from '../common/AppAlert.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const textFields = [
  ['nama', 'Nama Lengkap'],
  ['nik', 'NIK (16 digit)'],
  ['kk', 'Nomor KK (16 digit)'],
  ['alamat', 'Alamat'],
  ['wa', 'Nomor WhatsApp'],
];

function PasswordField({ id, label, value, show, setShow, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label} <span className="text-danger">*</span>
      </label>
      <div className="position-relative password-control">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={show ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}
          onClick={() => setShow((v) => !v)}
        >
          <AppIcon name={show ? 'eye-slash' : 'eye'} />
        </button>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const [form, setForm] = useState({
    nama: '', nik: '', kk: '', alamat: '', wa: '',
    email: '', password: '', confirm: '', ktp: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { register } = useAuth();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onKtp = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      update('ktp', null);
      e.target.value = '';
      setError('File KTP harus berupa gambar.');
      return;
    }
    if (file.size > 500 * 1024) {
      update('ktp', null);
      e.target.value = '';
      setError('Ukuran foto KTP maksimal 500 KB. Pilih foto yang lebih kecil.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update('ktp', reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const required = ['nama', 'nik', 'kk', 'alamat', 'wa', 'password', 'confirm'];
    if (required.some((k) => !String(form[k]).trim())) {
      setError('Lengkapi semua field wajib.');
      setSubmitting(false);
      return;
    }
    if (!/^\d{16}$/.test(form.nik)) {
      setError('NIK harus terdiri dari 16 digit angka.');
      setSubmitting(false);
      return;
    }
    if (!/^\d{16}$/.test(form.kk)) {
      setError('Nomor KK harus terdiri dari 16 digit angka.');
      setSubmitting(false);
      return;
    }
    if (!/^\d{9,15}$/.test(form.wa)) {
      setError('Nomor WhatsApp tidak valid. Gunakan angka tanpa spasi.');
      setSubmitting(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      setSubmitting(false);
      return;
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password harus sama.');
      setSubmitting(false);
      return;
    }
    if (!form.ktp) {
      setError('Foto KTP wajib dipilih.');
      setSubmitting(false);
      return;
    }
    try {
      await register(form);
      nav('/verifikasi');
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className="h5 mb-3">Data Diri</h2>
      <div className="row g-3">
        {textFields.map(([key, label]) => (
          <div className={key === 'alamat' ? 'col-12' : 'col-md-6'} key={key}>
            <label className="form-label fw-semibold" htmlFor={key}>
              {label} <span className="text-danger">*</span>
            </label>
            {key === 'alamat' ? (
              <textarea id={key} rows="3" className="form-control" value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder="Alamat sesuai dokumen"></textarea>
            ) : (
              <input id={key} inputMode={key === 'nik' || key === 'kk' || key === 'wa' ? 'numeric' : undefined} maxLength={key === 'nik' || key === 'kk' ? 16 : undefined} className="form-control" value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={label} />
            )}
          </div>
        ))}
        <div className="col-12">
          <label className="form-label fw-semibold" htmlFor="email">Email (opsional)</label>
          <input id="email" type="email" className="form-control" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="nama@email.com" />
        </div>
      </div>

      <h2 className="h5 mt-5 mb-3">Akun</h2>
      <div className="row g-3">
        <div className="col-md-6"><PasswordField id="password" label="Password" value={form.password} show={showPassword} setShow={setShowPassword} onChange={(v) => update('password', v)} /></div>
        <div className="col-md-6"><PasswordField id="confirm" label="Konfirmasi Password" value={form.confirm} show={showConfirm} setShow={setShowConfirm} onChange={(v) => update('confirm', v)} /></div>
      </div>

      <h2 className="h5 mt-5 mb-3">Dokumen</h2>
      <div className="upload-box p-3 p-md-4">
        <label className="form-label fw-semibold" htmlFor="ktp">
          Foto KTP <span className="text-danger">*</span>
        </label>
        <input id="ktp" type="file" accept="image/*" className="form-control" onChange={onKtp} />
        <small className="text-muted d-block mt-2">Gunakan foto yang jelas. Maksimal 500 KB, disimpan sebagai data pendaftaran.</small>
        {form.ktp && <img src={form.ktp} className="upload-preview mt-3" alt="Preview foto KTP" />}
      </div>

      {error && <AppAlert type="danger">{error}</AppAlert>}

      <button className="btn btn-brand btn-lg w-100 mt-3" type="submit" disabled={submitting}>
        {submitting ? 'Mengirim…' : 'Daftar Sekarang'} <AppIcon name="person-plus" className="ms-1" />
      </button>
    </form>
  );
}