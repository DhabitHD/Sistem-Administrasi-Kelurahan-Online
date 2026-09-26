import { lazy, Suspense, useEffect, useState } from 'react';

/* lottie-web is ~330 kB. Most services have no JSON in public/assets/icons/layanan/,
   so the player must not be in the initial graph — it is fetched only once an
   animation file actually exists. */
const Lottie = lazy(() => import('lottie-react').then((m) => ({ default: m.Lottie })));

const cache = {};
/* N cards sharing one animation file used to fire N fetches before the first
   resolved and populated the cache. */
const inflight = new Map();

export default function LottieIcon({ src, size = 44, fallback = null }) {
  const [data, setData] = useState(cache[src] || null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    /* Reset per src: these instances are reused across a list, and a sticky
       `missing` meant one 404 made every later card fall back to a static icon. */
    setMissing(false);
    setData(cache[src] || null);
    if (!src) { setMissing(true); return; }
    if (cache[src]) { setData(cache[src]); return; }
    let on = true;
    if (!inflight.has(src)) {
      inflight.set(
        src,
        fetch(src)
          .then((r) => { if (!r.ok) throw new Error('not found'); return r.json(); })
          .then((json) => { cache[src] = json; return json; })
          .finally(() => inflight.delete(src))
      );
    }
    inflight
      .get(src)
      .then((json) => { if (on) setData(json); })
      .catch(() => { if (on) setMissing(true); });
    return () => { on = false; };
  }, [src]);

  if (!src || missing) return fallback;
  if (!data) return fallback;
  return (
    <Suspense fallback={fallback}>
      <Lottie animationData={data} loop autoplay style={{ width: size, height: size }} />
    </Suspense>
  );
}