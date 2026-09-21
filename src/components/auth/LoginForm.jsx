import { useState } from 'react';
import AppIcon from '../common/AppIcon.jsx';
import { Link, useNavigate } from 'react-router-dom';
import AppAlert from '../common/AppAlert.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function LoginForm() {
  const [form, setForm] = useState({ identity: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const resetData = () => {
    if (!window.confirm('Keluar dari sesi dan muat ulang halaman? Data kini tersimpan di server backend.')) return;
    window.location.reload();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);

    if (!form.identity.trim() || !form.password.trim()) {
      setError('NIK / Email dan password wajib diisi.');
      setSubmitting(false);
      return;
    }
    const result = await login(form.identity, form.password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    nav(result.user.role === 'admin' ? '/admin' : '/warga');
  };

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="identity">NIK / Email</label>
        <input
          id="identity"
          autoComplete="username"
          className="form-control form-control-lg"
          value={form.identity}
          onChange={(e) => setForm({ ...form, identity: e.target.value })}
          placeholder="Masukkan NIK atau email"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="password">Password</label>
        <div className="position-relative password-control">
          <input
            id="password"
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            className="form-control form-control-lg"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Masukkan password"
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            onClick={() => setShowPassword((v) => !v)}
          >
            <AppIcon name={showPassword ? 'eye-slash' : 'eye'} />
          </button>
        </div>
      </div>

      {error && <AppAlert type="danger">{error}</AppAlert>}

<div className="alert alert-brand-soft small py-2 px-3">
        <span className="d-block mb-1"><AppIcon name="info-circle" className="me-1" />Warga demo:</span>
        <span><code>3571********1234</code>&nbsp;·&nbsp;<code>demo1234</code></span>
        <span className="d-block mt-1"><AppIcon name="info-circle" className="me-1" />Admin:</span>
        <span><code>admin@betet.id</code>&nbsp;·&nbsp;<code>admin1234</code></span>
      </div>

      <button className="btn btn-brand btn-lg w-100" type="submit" disabled={submitting}>
        {submitting ? 'Memproses…' : 'Masuk'} <AppIcon name="arrow-right" className="ms-1" />
      </button>

      <button type="button" className="btn btn-link btn-sm w-100 text-muted mt-2" onClick={resetData}>
        <AppIcon name="arrow-repeat" className="me-1" />Muat ulang data
      </button>

      <p className="text-center mt-4 mb-0">
        Belum punya akun?{' '}
        <Link to="/register" className="text-brand fw-semibold">Daftar warga</Link>
      </p>
    </form>
  );
}
