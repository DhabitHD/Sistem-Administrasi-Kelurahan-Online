import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppIcon from './AppIcon.jsx';

/** Banner global untuk respons 403 API (didispatch sebagai `betet:forbidden`
    oleh interceptor di services/api.js). Tanpa ini penolakan akses sunyi:
    user mengira tombolnya rusak. */
export default function ForbiddenNotice() {
  const [msg, setMsg] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    const onForbidden = (e) => setMsg(e?.detail?.message || 'Akses ditolak.');
    window.addEventListener('betet:forbidden', onForbidden);
    return () => window.removeEventListener('betet:forbidden', onForbidden);
  }, []);

  /* Jaring pengaman: banner 403 adalah konteks halaman saat ia muncul.
     Tanpa ini, pesan basi (mis. dari percobaan sebelum login) ikut tampil
     di halaman berikutnya bahkan setelah sesi berganti. */
  useEffect(() => {
    setMsg('');
  }, [pathname]);

  if (!msg) return null;

  return (
    <div className="container mt-3" role="alert">
      <div className="alert alert-danger d-flex align-items-center gap-2 mb-0">
        <AppIcon name="shield-check" className="flex-shrink-0" />
        <span className="flex-grow-1 small">{msg}</span>
        <button type="button" className="btn-close" aria-label="Tutup peringatan" onClick={() => setMsg('')} />
      </div>
    </div>
  );
}
