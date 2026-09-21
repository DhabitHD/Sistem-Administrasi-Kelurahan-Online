import { useEffect, useState } from 'react';
import { Lottie } from 'lottie-react';

const cache = {};

export default function LottieIcon({ src, size = 44, fallback = null }) {
  const [data, setData] = useState(cache[src] || null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!src) { setMissing(true); return; }
    if (cache[src]) { setData(cache[src]); return; }
    let on = true;
    fetch(src)
      .then((r) => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then((json) => { cache[src] = json; if (on) setData(json); })
      .catch(() => { if (on) setMissing(true); });
    return () => { on = false; };
  }, [src]);

  if (!src || missing) return fallback;
  if (!data) return fallback;
  return <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />;
}