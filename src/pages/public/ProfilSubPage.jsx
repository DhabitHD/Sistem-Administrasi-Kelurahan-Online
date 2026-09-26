import { Link, useParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useProfil, usePerangkat } from '../../services/contentStore.js';

const content = {
  sejarah: {
    title: 'Sejarah Kelurahan Betet',
    eyebrow: 'PROFIL · SEJARAH',
    intro: 'Kelurahan Betet merupakan salah satu kelurahan di Kecamatan Pesantren, Kota Kediri.',
    body: [
      'Riwayat nama Betet memiliki cerita yang berkaitan dengan kisah perjuangan pada masa lampau. Dalam cerita sejarah lokal yang dihimpun oleh website Kelurahan Betet, nama Betet dikaitkan dengan burung berwarna hijau yang dilihat dalam perjalanan Onggojoyo.',
      'Halaman ini disiapkan sebagai ruang editorial untuk melengkapi kronologi sejarah, sumber arsip, dokumentasi, serta cerita masyarakat secara lebih terstruktur.',
    ],
  },
  'visi-misi': {
    title: 'Visi & Misi Kelurahan Betet',
    eyebrow: 'PROFIL · VISI & MISI',
    intro: 'Arah pembangunan kelurahan diterjemahkan melalui visi yang jelas dan misi yang mudah dipahami masyarakat.',
    body: [
      'VISI: Mewujudkan Kelurahan Betet yang maju, mandiri, tertib, dan sejahtera dengan pelayanan publik yang mudah diakses serta partisipasi masyarakat yang kuat.',
      'MISI: meningkatkan kualitas pelayanan publik; memperkuat keterbukaan informasi; mendorong pemberdayaan masyarakat; menjaga lingkungan yang aman, bersih, dan nyaman; serta mengembangkan potensi wilayah secara kolaboratif.',
    ],
  },
  'struktur-organisasi': {
    title: 'Struktur Organisasi Kelurahan Betet',
    eyebrow: 'PROFIL · STRUKTUR ORGANISASI',
    intro: 'Susunan perangkat dan jabatan pemerintahan Kelurahan Betet, Kecamatan Pesantren, Kota Kediri.',
    body: [
      'Struktur organisasi Kelurahan Betet dipimpin oleh lurah dan dibantu oleh sekretaris kelurahan serta tiga seksi pelayanan, mengikuti ketentuan organisasi perangkat daerah.',
    ],
    orgList: true,
  },
  demografi: {
    title: 'Demografi Kelurahan Betet',
    eyebrow: 'PROFIL · DEMOGRAFI',
    intro: 'Informasi wilayah, kondisi geografis, dan karakter demografi menjadi dasar untuk memahami kebutuhan masyarakat.',
    body: [
      'Kelurahan Betet berada di Kecamatan Pesantren, Kota Kediri, Jawa Timur. Wilayahnya termasuk dataran rendah dan berada di bagian timur Sungai Brantas.',
      'Mayoritas warga bekerja pada sektor perdagangan dan usaha mikro, dengan dukungan layanan administrasi kependudukan yang berjalan setiap hari kerja.',
    ],
  },
};

const demografiStats = [
  ['Luas Wilayah', '3,2 km²', 'map'],
  ['Jumlah Penduduk', '8.430 jiwa', 'people'],
  ['Kepala Keluarga', '2.450 KK', 'home'],
  ['RW / RT', '6 RW · 25 RT', 'layers'],
  ['Kepadatan Penduduk', '±2.640 jiwa/km²', 'bar-chart'],
  ['Jenis Kelamin', '50% Laki · 50% Perempuan', 'users'],
];

const batasWilayah = [
  ['Utara', 'Kecamatan Pesantren', 'compass'],
  ['Timur', 'Sungai Brantas', 'waves'],
  ['Selatan', 'Wilayah Kota Kediri bagian selatan', 'compass'],
  ['Barat', 'Kawasan permukiman & pertanian', 'waves'],
];

const pekerjaan = [
  ['Wirausaha / Perdagangan', 34],
  ['Buruh & Tenaga Kerja', 28],
  ['Petani & Nelayan', 21],
  ['PNS / TNI / Polri', 9],
  ['Lainnya', 8],
];

const statsDimensi = [
  {
    id: 'pendidikan',
    label: 'Tingkat Pendidikan',
    rows: [
      ['Belum / Sedang Sekolah', 940, 905],
      ['SD / Sederajat', 1205, 1150],
      ['SMP / Sederajat', 615, 590],
      ['SMA / Sederajat', 945, 1010],
      ['Diploma', 145, 175],
      ['Sarjana (S1)', 310, 340],
      ['Pascasarjana (S2/S3)', 55, 45],
    ],
  },
  {
    id: 'agama',
    label: 'Agama',
    rows: [
      ['Islam', 4020, 3995],
      ['Kristen Protestan', 85, 92],
      ['Katolik', 70, 78],
      ['Hindu', 18, 22],
      ['Buddha', 16, 20],
      ['Konghucu', 6, 8],
    ],
  },
  {
    id: 'golongan',
    label: 'Golongan Darah',
    rows: [
      ['Golongan A', 1040, 1030],
      ['Golongan B', 1120, 1110],
      ['Golongan AB', 430, 420],
      ['Golongan O', 1625, 1655],
    ],
  },
  {
    id: 'kawin',
    label: 'Status Perkawinan',
    rows: [
      ['Belum Kawin', 1390, 1320],
      ['Kawin', 2480, 2490],
      ['Cerai Hidup', 95, 130],
      ['Cerai Mati', 250, 275],
    ],
  },
];

const grandTotal = statsDimensi.map((d) => d.rows.reduce((s, r) => s + r[1] + r[2], 0));

const mapSrc =
  'https://www.google.com/maps?q=-7.8506564,112.0434437&hl=id&z=17&output=embed';

const initials = (name) => name.split(' ').filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('');

export default function ProfilSubPage() {
  const { section } = useParams();
  const profil = useProfil();
  const perangkatItems = [...(usePerangkat() || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const item = content[section];
  if (!item) return <div className="container py-5"><div className="empty-state"><h1>Halaman tidak ditemukan</h1><Link to="/profil" className="btn btn-brand mt-3">Kembali ke Profil</Link></div></div>;

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">{item.eyebrow}</span>
        <h1 className="mt-3">{item.title}</h1>
        <p className="lead">{item.intro}</p>
      </div>
<div className="row g-4">
        <div className="col-lg-8">
          <div className="simple-box">
            {section !== 'visi-misi' && (
              section === 'struktur-organisasi' && profil?.struktur_desc
                ? <p className="fs-5 lh-lg">{profil.struktur_desc}</p>
                : item.body.map((p, i) => <p key={i} className="fs-5 lh-lg">{p}</p>)
            )}

            {section === 'visi-misi' && (
              <>
                <p className="mb-0 fs-5 lh-lg"><strong className="text-brand">VISI.</strong> {profil?.visi || item.body[0].replace(/^VISI:\s*/, '')}</p>
                <p className="mt-4 mb-1 fs-5 lh-lg"><strong className="text-brand">MISI.</strong></p>
                <ol className="fs-5 lh-lg mb-0">
                  {(Array.isArray(profil?.misi) && profil.misi.length ? profil.misi : item.body[1].replace(/^MISI:\s*/, '').split('; ')).map((m, i) => <li key={i}>{m}</li>)}
                </ol>
              </>
            )}
          </div>

          {section === 'sejarah' && (
            <figure className="mt-4">
              <img
                src="/assets/placeholders/struktur-pemerintahan.jpg"
                alt="Ilustrasi sejarah Kelurahan Betet"
                className="img-fluid rounded-4 w-100"
                loading="lazy"
                decoding="async"
                style={{ maxHeight: 420, objectFit: 'cover' }}
              />
              <figcaption className="small text-muted mt-2">
                Ilustrasi — ganti dengan foto/arsip sejarah asli saat tersedia.
              </figcaption>
            </figure>
          )}

          {section === 'demografi' && (
            <div className="mt-4">
              <div className="row g-3">
                {demografiStats.map(([label, value, icon]) => (
                  <div className="col-6 col-md-4" key={label}>
                    <div className="dstat-card">
                      <span className="dstat-icon"><AppIcon name={icon} size={18} /></span>
                      <div className="dstat-val">{value}</div>
                      <small className="dstat-label">{label}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-4 mt-1">
                <div className="col-lg-7">
                  <div className="side-card h-100">
                    <h2 className="h5 mb-3"><AppIcon name="landmark" className="text-brand me-2" />Batas Wilayah Kelurahan</h2>
                    <div className="row g-3">
                      {batasWilayah.map(([arah, wilayah, icon]) => (
                        <div className="col-sm-6" key={arah}>
                          <div className="batas-item">
                            <span className="batas-arah"><AppIcon name={icon} size={15} />{arah}</span>
                            <strong className="d-block mt-1">{wilayah}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="side-card h-100">
                    <h2 className="h5 mb-3"><AppIcon name="bar-chart" className="text-brand me-2" />Mata Pencaharian</h2>
                    {pekerjaan.map(([name, pct]) => (
                      <div className="mb-3" key={name}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">{name}</span>
                          <strong>{pct}%</strong>
                        </div>
                        <div className="work-bar"><div className="work-bar-fill" style={{ width: `${pct}%` }}></div></div>
                      </div>
                    ))}
                    <small className="text-muted">Perkiraan sebaran pekerjaan warga.</small>
                  </div>
                </div>
              </div>

<div className="mt-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <h2 className="h5 mb-0"><AppIcon name="bar-chart" className="text-brand me-2" />Statistik Demografi</h2>
                  <div className="flex-grow-1 thin-line d-none d-sm-block" aria-hidden="true"></div>
                </div>
                <div className="d-flex gap-2 flex-wrap mb-4">
                  {statsDimensi.map((d) => (
                    <a key={d.id} href={`#dem-${d.id}`} className="btn btn-sm btn-outline-brand">{d.label}</a>
                  ))}
                </div>

                {statsDimensi.map((d, idx) => {
                  const sl = d.rows.reduce((s, r) => s + r[1], 0);
                  const sp = d.rows.reduce((s, r) => s + r[2], 0);
                  return (
                    <div id={`dem-${d.id}`} className="side-card mb-4" key={d.id}>
                      <h3 className="h6 mb-3">{d.label} <small className="text-muted fw-normal">Laki-laki / Perempuan</small></h3>
                      <div className="table-responsive">
                        <table className="table table-sm align-middle demograf-table mb-0">
                          <thead>
                            <tr><th>Kategori</th><th className="text-end">Laki-laki</th><th className="text-end">Perempuan</th><th className="text-end">Total</th></tr>
                          </thead>
                          <tbody>
                            {d.rows.map((r) => (
                              <tr key={r[0]}>
                                <td>{r[0]}</td>
                                <td className="text-end">{r[1].toLocaleString('id-ID')}</td>
                                <td className="text-end">{r[2].toLocaleString('id-ID')}</td>
                                <td className="text-end"><strong>{(r[1] + r[2]).toLocaleString('id-ID')}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Total</th>
                              <th className="text-end">{sl.toLocaleString('id-ID')}</th>
                              <th className="text-end">{sp.toLocaleString('id-ID')}</th>
                              <th className="text-end">{grandTotal[idx].toLocaleString('id-ID')}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              <small className="text-muted d-block mt-4">
                Angka statistik dan batas wilayah merupakan data contoh untuk pengembangan —
                perbarui dengan data resmi kelurahan saat tersedia.
              </small>
            </div>
          )}

          {item.orgList && (
            <div className="side-card mt-4">
              <h2 className="h5 mb-3">Struktur Organisasi</h2>
              <img
                src={profil?.struktur_image || '/assets/placeholders/struktur-pemerintahan.jpg'}
                alt="Struktur organisasi Kelurahan Betet"
                className="img-fluid rounded-3 mb-4 w-100"
                loading="lazy"
                decoding="async"
                style={{ maxHeight: 420, objectFit: 'cover' }}
              />
              <h3 className="h5 mb-3">Perangkat Kelurahan</h3>
              {perangkatItems.length === 0 ? (
                <p className="text-muted small">Data perangkat belum tersedia.</p>
              ) : (
                <div className="row g-4">
                  {perangkatItems.map((p) => (
                    <div className="col-md-6 col-lg-4" key={p.slug}>
                      <div className="staff-card h-100">
                        <div className="staff-photo-wrap">
                          <span className="staff-photo-fallback">{initials(p.name)}</span>
                          {p.photo && (
                            <img
                              src={p.photo}
                              alt={`Foto ${p.role}`}
                              className="staff-photo"
                              loading="lazy"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          {!p.photo && <span className="staff-photo-note"><AppIcon name="camera" size={13} /></span>}
                        </div>
                        <div className="p-4 pt-3">
                          <small className="text-brand fw-bold">{p.role}</small>
                          <h4 className="h6 mt-1 mb-0">{p.name}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/pemerintahan" className="btn btn-outline-brand mt-3">
                Buka Halaman Pemerintahan <AppIcon name="arrow-right" className="ms-1" />
              </Link>
            </div>
          )}
        </div>
        <div className="col-lg-4">
          {section === 'demografi' && (
            <div className="side-card mb-4">
              <h2 className="h5 mb-3"><AppIcon name="map" className="text-brand me-2" />Lokasi Kelurahan</h2>
              <div className="mb-3 overflow-hidden rounded" style={{ height: 230 }}>
                <iframe
                  title="Peta wilayah Kelurahan Betet"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-100 h-100 border-0"
                ></iframe>
              </div>
              <p className="mb-1"><strong>Kantor Kelurahan Betet</strong></p>
              <p className="text-muted small mb-2">Jl. Raya Betet Bawang 76, Kecamatan Pesantren, Kota Kediri, Jawa Timur</p>
              <p className="small text-muted mb-1"><AppIcon name="telephone" size={13} className="me-1" />(0354) 682955</p>
              <p className="small text-muted mb-2"><AppIcon name="clock" size={13} className="me-1" />Senin–Kamis 08.00–15.00 WIB · Jumat 07.00–14.00 WIB</p>
              <a
                className="btn btn-sm btn-outline-brand w-100"
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps?q=-7.8506564,112.0434437"
              >
                Buka di Google Maps <AppIcon name="box-arrow-up-right" className="ms-1" size={14} />
              </a>
            </div>
          )}

          <div className="side-card">
            <div className="doc-icon mb-3"><AppIcon name="info-circle" /></div>
            <h2 className="h5">Tentang sumber data</h2>
            <p className="text-muted mb-3">Konten ini disiapkan untuk mengikuti struktur informasi pada website Kelurahan Betet dan dapat diperbarui dengan data resmi terbaru.</p>
            <Link to="/kontak" className="btn btn-outline-brand">Kontak Kelurahan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
