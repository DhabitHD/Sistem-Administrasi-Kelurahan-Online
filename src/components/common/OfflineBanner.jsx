import { useEffect, useState } from 'react';
import AppIcon from './AppIcon.jsx';

/** Banner offline ringan tanpa service worker: cegah form dikira rusak saat putus koneksi. */
export default function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (online) return null;
  return (
    <div className="alert alert-warning text-center mb-0 rounded-0" role="alert">
      <AppIcon name="wifi-off" className="me-2" />
      Anda sedang offline. Data yang tampil mungkin kedaluwarsa; pengajuan baru akan gagal sampai koneksi pulih.
    </div>
  );
}
