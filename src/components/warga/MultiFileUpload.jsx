import { useRef } from 'react';
import AppIcon from '../common/AppIcon.jsx';

const isImage = (f) => f.type.startsWith('image/');
const isDoc = (f) => /\.(pdf|doc|docx)$/i.test(f.name);

export default function MultiFileUpload({
  id,
  label,
  accept = '*',
  imagesOnly = false,
  maxSize = 2 * 1024 * 1024,
  maxFiles = 5,
  value = [],
  onChange,
  onError,
}) {
  const inputRef = useRef(null);

  const addFiles = (files) => {
    const list = Array.from(files);
    if (value.length + list.length > maxFiles) {
      onError?.(`Maksimal ${maxFiles} file.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    for (const file of list) {
      const okType = imagesOnly ? isImage(file) : isImage(file) || isDoc(file);
      if (!okType) {
        onError?.(imagesOnly ? 'File harus berupa gambar.' : 'File harus berupa gambar, PDF, atau Word (doc/docx).');
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      if (file.size > maxSize) {
        const size = maxSize >= 1024 * 1024 ? `${maxSize / (1024 * 1024)} MB` : `${Math.round(maxSize / 1024)} KB`;
        onError?.(`Ukuran file maksimal ${size}.`);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
    }
    Promise.all(
      list.map((f) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: f.name, dataUrl: reader.result });
        reader.onerror = reject;
        reader.readAsDataURL(f);
      }))
    )
      /* Use a functional update: two rapid file picks share the same render, and
         onChange([...value, ...items]) in the second closes over the stale `value`
         from before the first. Using (prev) => ... lets the second append to the
         first's result rather than overwriting it. */
      .then((items) => {
        /* Clear the previous complaint only once this selection actually
           succeeded. Clearing at the top of addFiles() wiped unrelated form
           errors (PengaduanBaru wires onError straight to its error state) the
           moment the resident picked any file. */
        onError?.('');
        onChange((prev) => [...(prev ?? []), ...items]);
      })
      .catch(() => onError?.('Gagal membaca file.'))
      .finally(() => { if (inputRef.current) inputRef.current.value = ''; });
  };

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="form-label fw-semibold" htmlFor={id}>{label}</label>
      <input
        id={id}
        ref={inputRef}
        type="file"
        className="form-control"
        accept={accept}
        multiple
        onChange={(e) => addFiles(e.target.files)}
      />
      {value.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {value.map((it, i) => (
            <div className="position-relative" key={`${it.name}-${i}`}>
              {it.dataUrl.startsWith('data:image/') ? (
                <img src={it.dataUrl} alt={it.name} className="upload-preview" style={{ width: 72, height: 54, objectFit: 'cover' }} />
              ) : (
                <div className="d-flex align-items-center gap-2 border rounded p-2 bg-white" style={{ maxWidth: 200, height: 54 }}>
                  <AppIcon name="file-earmark-text" size={18} className="text-brand flex-shrink-0" />
                  <span className="small text-truncate mb-0">{it.name}</span>
                </div>
              )}
              <button
                type="button"
                className="btn btn-sm btn-light position-absolute top-0 end-0 p-0 border rounded-circle"
                style={{ width: 20, height: 20, lineHeight: 1 }}
                onClick={() => remove(i)}
                aria-label={`Hapus ${it.name}`}
                title="Hapus"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}