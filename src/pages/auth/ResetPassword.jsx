import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppAlert from '../../components/common/AppAlert.jsx';
import { resetPassword } from '../../services/store.js';

export default function ResetPassword() {
  const [form, setForm] = useState({ email: '', token: '', password: '', password_confirmation: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 8) {
      setErr('Password minimal 8 karakter.');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setErr('Konfirmasi password tidak sama.');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(form);
      nav('/login', { replace: true });
    } catch (e2) {
      setErr(e2?.message || 'Gagal mereset password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="auth-card">
              <h1 className="h3">Reset password</h1>
              <p className="text-muted">Tempel token dari email, lalu buat password baru.</p>
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="rp-email">Email</label>
                  <input id="rp-email" type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="rp-token">Token</label>
                  <input id="rp-token" className="form-control" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} placeholder="64 karakter dari email" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="rp-pass">Password baru</label>
                  <input id="rp-pass" type="password" autoComplete="new-password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="rp-pass2">Konfirmasi password</label>
                  <input id="rp-pass2" type="password" autoComplete="new-password" className="form-control" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
                </div>
                {err && <AppAlert type="danger">{err}</AppAlert>}
                <button className="btn btn-brand btn-lg w-100" disabled={busy}>{busy ? 'Menyimpan…' : 'Reset password'}</button>
              </form>
              <p className="text-center mt-3 mb-0"><Link to="/login" className="text-brand">Kembali masuk</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
