import { useEffect, useState } from 'react';
import { isPrivatePath, privateFileUrl } from '../../services/api.js';

/** Resolve path berkas menjadi URL pakai-href/src + status gagal. */
export function usePrivateUrl(path) {
  const [state, setState] = useState({
    url: isPrivatePath(path) ? null : (path || null),
    failed: false,
  });
  useEffect(() => {
    if (!isPrivatePath(path)) {
      setState({ url: path || null, failed: false });
      return undefined;
    }
    let on = true;
    setState({ url: null, failed: false });
    privateFileUrl(path).then(
      (u) => { if (on) setState({ url: u, failed: false }); },
      () => { if (on) setState({ url: null, failed: true }); }
    );
    return () => { on = false; };
  }, [path]);
  return state;
}

/**
 * <img> yang memahami path privat `private/...` (diambil ber-auth lalu
 * ditampilkan sebagai object URL). Path publik & dataURL dirender langsung.
 * Gagal fetch → disembunyikan (setara perilaku onError sembunyi yang lama);
 * gagal load gambar → onError diteruskan apa adanya.
 */
export default function PrivateImg({ src, alt = '', className = '', style, onError, ...rest }) {
  const { url, failed } = usePrivateUrl(src);
  if (!url) {
    return (
      <span
        className={className}
        style={{
          display: failed ? 'none' : 'inline-block',
          background: 'var(--color-surface-muted, #eef0f4)',
          ...style,
        }}
        role="img"
        aria-label={alt}
        {...rest}
      />
    );
  }
  return <img src={url} alt={alt} className={className} style={style} onError={onError} {...rest} />;
}
