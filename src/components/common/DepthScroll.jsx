import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function DepthScroll() {
  const { pathname } = useLocation();
  const raf = useRef(0);
  const els = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sample = () => {
      els.current = [...document.querySelectorAll('.reveal.revealed')];
    };
    const update = () => {
      raf.current = 0;
      const vh = window.innerHeight;
      const mid = vh / 2;
      els.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) {
          el.style.setProperty('--depth-y', '0px');
          return;
        }
        const d = r.top + r.height / 2 - mid;
        const speed = 0.35 + (i % 3) * 0.3;
        const y = Math.max(-26, Math.min(26, d * 0.03 * speed));
        el.style.setProperty('--depth-y', `${y.toFixed(1)}px`);
      });
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };

    sample();
    update();
    const mo = new MutationObserver(sample);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mo.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
      els.current.forEach((el) => el.style.setProperty('--depth-y', '0px'));
    };
  }, [pathname]);

  return null;
}