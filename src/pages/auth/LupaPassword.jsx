import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppAlert from '../../components/common/AppAlert.jsx';
import { forgotPassword } from '../../services/store.js';

export default function LupaPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr('Masukkan email yang valid.');
      return;
    }
    setBusy(true);
    try {
      const r = await forgotPassword(email);
      setMsg(r?.message || 'Bila email terdaftar, token reset telah dikirim.');
    } catch (e2) {
      setErr(e2?.message || 'Gagal meminta reset.');
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
              <h1 className="h3">Lupa password</h1>
              <p className="text-muted">Masukkan email akun. Token reset berlaku 60 menit.</p>
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="fp-email">Email</label>
                  <input id="fp-email" type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" />
                </div>
                {err && <AppAlert type="danger">{err}</AppAlert>}
                {msg && <AppAlert type="success">{msg} <Link to="/reset-password">Lanjut reset</Link></AppAlert>}
                <button className="btn btn-brand btn-lg w-100" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim token'}</button>
              </form>
              <p className="text-center mt-3 mb-0"><Link to="/login" className="text-brand">Kembali masuk</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
