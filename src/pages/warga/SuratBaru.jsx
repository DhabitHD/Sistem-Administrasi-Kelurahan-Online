import { useEffect, useState } from 'react';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { createLetter, uploadDataUrl } from '../../services/store.js';
import { useLayanan } from '../../services/contentStore.js';
import AppAlert from '../../components/common/AppAlert.jsx';
import MultiFileUpload from '../../components/warga/MultiFileUpload.jsx';

export default function SuratBaru() {
  const layanan = useLayanan();
  const letterTypes = layanan.filter(
    (l) => l.slug.startsWith('surat-') || l.slug === 'kia'
  );
  const nav = useNavigate();
  const [params] = useSearchParams();
  const preselect = params.get('jenis');
  const [form, setForm] = useState({ jenis: '', description: '', catatan: '', attachments: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  const selectedType = letterTypes.find((l) => l.name === form.jenis) || null;

  useEffect(() => {
    if (!form.jenis && letterTypes.length > 0) {
      const pre = letterTypes.find((l) => l.slug === preselect)?.name || letterTypes[0].name;
      setForm((f) => ({ ...f, jenis: pre }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterTypes.length, preselect]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.jenis) {
      setError('Pilih jenis surat terlebih dahulu.');
      return;
    }
    if (!form.description.trim()) {
      setError('Keperluan pengajuan wajib diisi.');
      return;
    }
    setSending(true);
    try {
      const attachments = await Promise.all(form.attachments.map((a) => uploadDataUrl(a.dataUrl)));
      const letter = await createLetter({ jenis: form.jenis, description: form.description, catatan: form.catatan, attachments: attachments.length ? attachments : null });
      setSuccess(`Pengajuan ${letter.id_code} berhasil dikirim.${attachments.length ? ` ${attachments.length} lampiran terunggah.` : ''}`);
      setForm((f) => ({ ...f, description: '', catatan: '', attachments: [] }));
      setTimeout(() => nav('/warga/surat'), 900);
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengajuan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <span className="eyebrow text-brand">PORTAL WARGA</span>
        <h1 className="h2 mt-2">Ajukan Surat</h1>
        <p className="lead text-muted">
          Lengkapi form berikut untuk mengajukan surat keterangan kelurahan.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {letterTypes.length === 0 ? (
            <div className="dashboard-card p-5 text-center">
              <div className="service-icon mx-auto"><AppIcon name="file-earmark-text" /></div>
              <h2 className="h5 mt-3">Belum ada layanan surat</h2>
              <p className="text-muted mb-0">Admin belum menambahkan layanan surat. Coba lagi nanti.</p>
            </div>
          ) : (
          <div className="dashboard-card p-4">
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="jenis">Jenis Surat</label>
                <select id="jenis" className="form-select" value={form.jenis} onChange={(e) => update('jenis', e.target.value)}>
                  {letterTypes.map((l) => <option key={l.slug} value={l.name}>{l.name}</option>)}
                </select>
                <small className="text-muted">Persyaratan lengkap dapat dilihat di halaman layanan.</small>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="description">Keperluan</label>
                <textarea id="description" rows="4" className="form-control" placeholder="Contoh: Keperluan administrasi pinjaman" value={form.description} onChange={(e) => update('description', e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="catatan">Catatan tambahan (opsional)</label>
                <input id="catatan" className="form-control" placeholder="Nomor HP yang bisa dihubungi, dst." value={form.catatan} onChange={(e) => update('catatan', e.target.value)} />
              </div>
              <div className="mb-3">
                <MultiFileUpload
                  id="attachments"
                  label="Lampiran penunjang (opsional, maks 5)"
                  accept="image/*,application/pdf,.doc,.docx"
                  maxSize={2 * 1024 * 1024}
                  maxFiles={5}
                  value={form.attachments}
                  onChange={(attachments) => update('attachments', attachments)}
                  onError={setError}
                />
                <small className="text-muted d-block mt-1">Gambar, PDF, atau Word (doc/docx), masing-masing maksimal 2 MB. Contoh: scan KTP, KK, surat pengantar.</small>
              </div>

              {error && <AppAlert type="danger">{error}</AppAlert>}
              {success && <AppAlert type="success">{success}</AppAlert>}

              <button className="btn btn-brand" type="submit">
                Kirim Pengajuan <AppIcon name="send" className="ms-1" />
              </button>
              <Link to="/warga/surat" className="btn btn-outline-brand ms-2">Batal</Link>
            </form>
          </div>
          )}
        </div>
        <div className="col-lg-4">
          <div className="side-card">
            <div className="doc-icon mb-3"><AppIcon name="clipboard-check" /></div>
            <h2 className="h5">Pengingat — persyaratan</h2>
            <p className="small text-muted">
              Siapkan dokumen berikut sebelum mengajukan{' '}
              <strong>{selectedType?.name || 'surat yang dipilih'}</strong>:
            </p>
            {selectedType?.requirements?.length ? (
              <ul className="list-unstyled small mb-0">
                {selectedType.requirements.map((r, i) => (
                  <li key={i} className="d-flex gap-2 mb-2">
                    <AppIcon name="check-circle" size={16} className="text-brand flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small text-muted mb-0">Tidak ada persyaratan khusus tercantum.</p>
            )}
            <p className="small text-muted mb-0 mt-3">
              Lampirkan salinannya lewat form pengajuan untuk mempercepat verifikasi.
            </p>
          </div>
          <div className="side-card mt-4">
            <div className="doc-icon mb-3"><AppIcon name="file-earmark-text" /></div>
            <h2 className="h5">Kode pengajuan</h2>
            <p className="small text-muted mb-0">
              Setiap pengajuan mendapat kode <strong>SK-XXX</strong>. Gunakan kode
              tersebut untuk melacak status di halaman Pelacakan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}