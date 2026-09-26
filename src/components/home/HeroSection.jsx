import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import WaveDivider from '../common/WaveDivider.jsx';
import { trackVisit } from '../../services/store.js';
import { useHeroSlides } from '../../services/contentStore.js';

const DEFAULT_SLIDES = [
  {
    image: '/assets/placeholders/hero-banner.jpg',
    kicker: 'WEBSITE RESMI KELURAHAN BETET',
    title_before: 'Selamat Datang di Website ',
    title_span: 'Kelurahan Betet',
    lead: 'Sumber informasi terbaru tentang pemerintahan dan pelayanan di Kelurahan Betet, Kota Kediri.',
  },
  {
    image: '/assets/placeholders/struktur-pemerintahan.jpg',
    kicker: 'PELAYANAN PUBLIK',
    title_before: 'Pengajuan Surat Kini Bisa ',
    title_span: 'Online',
    lead: 'Warga terdaftar dapat mengajukan surat keterangan kelurahan tanpa harus antre di loket.',
  },
  {
    image: '/assets/placeholders/foto-lurah.jpg',
    kicker: 'KANAL PENGADUAN',
    title_before: 'Sampaikan Pengaduan dengan ',
    title_span: 'Mudah',
    lead: 'Laporkan kendala layanan atau lingkungan dan pantau statusnya secara real-time.',
  },
];

function useVisitCount() {
  const [visits, setVisits] = useState(0);
  useEffect(() => {
    let alive = true;
    trackVisit().then((r) => alive && r && setVisits(r.total));
    return () => {
      alive = false;
    };
  }, []);
  return visits;
}

export default function HeroSection() {
  const heroData = useHeroSlides();
  const slides = heroData.length > 0 ? heroData : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);
  const visits = useVisitCount();
  const dragging = useRef(null);
  const trackRef = useRef(null);
  const parRef = useRef(null);
  const total = slides.length;
  const safe = total ? index % total : 0;

  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    if (total < 2) return undefined;
    /* Pause on a backgrounded tab — a 6 s interval keeps firing in a hidden tab
       and the visitor returns to an arbitrary slide. */
    let timer = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [total]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY * 0.25, 90);
      if (parRef.current) parRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i) => setIndex(((i % total) + total) % total);

  const onPointerDown = (e) => {
    dragging.current = { x: e.clientX };
  };
  /* Without these, a pointerup lost to an OS gesture or a drag off-window left
     dragging.current holding a stale x, and the next pointerup computed a bogus
     dx — flipping the slide on an unrelated gesture. */
  const onPointerCancel = () => {
    dragging.current = null;
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.x;
    dragging.current = null;
    if (dx < -45) go(index + 1);
    else if (dx > 45) go(index - 1);
  };

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Selamat datang di Kelurahan Betet"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
    >
      {/* Slide images */}
      <div className="hero-parallax" ref={parRef}>
        <div
          className="hero-track"
          ref={trackRef}
          style={{ transform: `translateX(-${safe * 100}%)` }}
        >
          {slides.map((s, i) => (
            /* key={s.image} collided whenever an admin gave two slides the same
               preset image (AdminHero allows it), which broke reconciliation. */
            <div className="hero-slide" key={s.id ?? `${s.image}-${i}`} aria-hidden={i !== safe}>
              {/* Real <img> rather than a CSS background: preloadable, lazy-able and
                  visible to crawlers. Decorative only — the <h1> below carries the message. */}
              <img
                src={s.image}
                alt=""
                width="1600"
                height="900"
                decoding="async"
                {...(i === 0 ? { fetchpriority: 'high' } : { loading: 'lazy' })}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>

      {/* Arrows */}
      <button type="button" className="hero-arrow hero-arrow-left" aria-label="Slide sebelumnya" onClick={() => go(index - 1)}>
        <AppIcon name="arrow-left" size={22} />
      </button>
      <button type="button" className="hero-arrow hero-arrow-right" aria-label="Slide berikutnya" onClick={() => go(index + 1)}>
        <AppIcon name="arrow-right" size={22} />
      </button>

      {/* Content */}
      <div className="container position-relative z-1">
        <div className="hero-content text-center mx-auto" key={safe}>
          <span className="hero-kicker">{slides[safe].kicker}</span>
          <h1>
            {/* Explicit space: the default slides only read correctly because
                title_before happened to end in a space, and AdminHero's form gives
                no hint that a trailing space is load-bearing. */}
            {slides[safe].title_before}
            {' '}
            <span>{slides[safe].title_span}</span>
          </h1>
          <p className="lead">{slides[safe].lead}</p>
          <div className="hero-actions d-flex justify-content-center flex-column flex-sm-row gap-2 gap-sm-3 mt-4">
            <Link to="/layanan" className="btn btn-brand btn-lg px-4">
              Lihat Layanan <AppIcon name="arrow-right" className="ms-2" />
            </Link>
            <Link to="/pengaduan" className="btn btn-light btn-lg px-4 hero-outline">
              Ajukan Pengaduan
            </Link>
          </div>
        </div>
      </div>

      {/* Dots — plain toggle buttons. A tablist requires role="tabpanel" children,
          which a background-image carousel does not have, so the ARIA is dropped. */}
      <div className="hero-dots" role="group" aria-label="Pilih slide">
        {slides.map((s, i) => (
          <button
            type="button"
            key={s.id ?? `${s.image}-${i}`}
            aria-current={i === safe ? 'true' : undefined}
            aria-label={`Slide ${i + 1}`}
            className={i === safe ? 'active' : ''}
            onClick={() => go(i)}
          ></button>
        ))}
      </div>

      {/* Wave divider ke Layanan Unggulan */}
      <WaveDivider className="hero-wave" fill="#ffffff" />

      {/* Floating widgets */}
      <div className="floating-visit" role="status" aria-label="Informasi kunjungan website">
        <AppIcon name="bar-chart" size={22} />
        <div>
          <strong>Kunjungan</strong>
          <span>{visits} Hari Ini</span>
        </div>
        <AppIcon name="chevron-down" className="ms-auto" />
      </div>

      <Link to="/pengaduan" className="floating-complaint">
        <AppIcon name="arrow-right" size={20} />
        <span>Pengaduan</span>
      </Link>
    </section>
  );
}