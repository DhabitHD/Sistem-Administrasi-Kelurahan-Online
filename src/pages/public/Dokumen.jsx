import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useDokumen } from '../../services/contentStore.js';

const downloadText = (doc) => {
  const body = [
    doc.title,
    'KELURAHAN BETET — KOTA KEDIRI',
    '=================================',
    doc.desc,
    '',
    ...(Array.isArray(doc.content) ? doc.content : []),
    '',
    'Generated: ' + new Date().toLocaleString('id-ID'),
  ].join('\n');
  const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.slug}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function Dokumen() {
  const items = useDokumen();

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">DOKUMEN PUBLIK</span>
        <h1 className="mt-3">Dokumen dan informasi publik</h1>
        <p className="lead">Koleksi dokumen publik Kelurahan Betet dapat diunduh langsung tanpa login.</p>
      </div>
      {items.length === 0 ? (
        <div className="empty-state py-5">
          <p className="text-muted mb-0">Belum ada dokumen atau informasi publik.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((doc) => (
            <div className="col-md-6" key={doc.slug}>
              <div className="doc-card h-100">
                <div className="doc-icon"><AppIcon name={doc.icon || 'file-earmark-text'} size={20} /></div>
                <div className="flex-grow-1">
                  <h2 className="h5 mb-1">{doc.title}</h2>
                  <p className="small text-muted mb-3">{doc.desc}</p>
                  {Array.isArray(doc.content) && doc.content.length > 0 && (
                    <div className="small mb-3">
                      {doc.content.map((p, i) => <p key={i} className="mb-2">{p}</p>)}
                    </div>
                  )}
                  {doc.file ? (
                    <a href={doc.file} download target="_blank" rel="noreferrer" className="btn btn-sm btn-brand">
                      <AppIcon name="download" className="me-1" /> Unduh Dokumen
                    </a>
                  ) : (
                    <button type="button" className="btn btn-sm btn-brand" onClick={() => downloadText(doc)}>
                      <AppIcon name="download" className="me-1" /> Unduh Dokumen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5"><Link to="/profil" className="btn btn-brand">Kembali ke Profil</Link></div>
    </div>
  );
}