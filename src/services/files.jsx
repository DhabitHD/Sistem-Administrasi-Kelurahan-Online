import AppIcon from '../components/common/AppIcon.jsx';

export const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : null);

/* Phone numbers are stored for humans — "(0354) 682955", "0812-3456-7890".
   Prefixing "+" to the raw digits produced tel:+0354682955, which is not a valid
   international number, so the homepage "Hubungi" button dialled nothing.
   Normalise to +62 and drop the national trunk 0. */
export const telHref = (telp) => {
  const digits = String(telp || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('62')) return `tel:+${digits}`;
  return `tel:+62${digits.replace(/^0/, '')}`;
};

/* Backend-stored file paths may be absolute or root-relative (/storage/uploads/...).
   Both are fine; anything else (javascript:, data:) is not. */
export const safeFileUrl = (u) => (/^https?:\/\//i.test(u || '') || /^\//.test(u || '') ? u : null);

export const isImagePath = (p) => /\.(jpe?g|png|gif|webp|bmp)$/i.test((p || '').split('?')[0]);

export const fileBaseName = (p) => {
  const name = (p || '').split('/').pop().split('?')[0];
  return name || 'Lampiran';
};

export const fileIcon = (p) => (isImagePath(p) ? 'image' : /\.docx?$/i.test(p) ? 'file-earmark-text' : /\.pdf$/i.test(p) ? 'file-text' : 'paperclip');

export function AttachmentList({ files = [], title = 'Lampiran' }) {
  if (!files || files.length === 0) return null;
  return (
    <div className="mt-3 pt-2 border-top border-light">
      <strong className="d-block small mb-2">
        <AppIcon name="paperclip" size={14} className="text-brand me-1" />
        {title} ({files.length})
      </strong>
      <div className="d-flex flex-column gap-1">
        {files.map((f, i) => {
          const href = safeFileUrl(f) || '#';
          return isImagePath(f) ? (
            <a key={i} href={href} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 text-decoration-none">
              <img src={href} alt={`${title} ${i + 1}`} loading="lazy" className="rounded" style={{ width: 64, height: 48, objectFit: 'cover' }} />
              <small className="text-muted">{fileBaseName(f)}</small>
            </a>
          ) : (
            <a key={i} href={href} target="_blank" rel="noreferrer" className="small text-brand text-decoration-none d-inline-flex align-items-center gap-1">
              <AppIcon name={fileIcon(f)} size={14} />
              {fileBaseName(f)}
            </a>
          );
        })}
      </div>
    </div>
  );
}