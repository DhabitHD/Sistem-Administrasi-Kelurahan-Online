const flows = {
  pengaduan: ['DIAJUKAN', 'IN_PROGRESS', 'CLOSED'],
  surat: ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL', 'CLOSED'],
};

const labels = {
  DIAJUKAN: 'Pengajuan diterima',
  IN_PROGRESS: 'Sedang diproses',
  SIAP_DIAMBIL: 'Siap diambil',
  CLOSED: 'Selesai',
  DITOLAK: 'Ditolak',
};

export default function StatusTimeline({ kind, status }) {
  const steps = flows[kind] || flows.pengaduan;
  const idx = steps.indexOf(status);
  const done = idx >= 0 ? idx : -1;

  return (
    <ol className="status-timeline mb-0">
      {steps.map((s, i) => (
        <li key={s} className={i <= done ? 'done' : ''}>
          <span className="tl-dot" aria-hidden="true"></span>
          <div>
            <span className="tl-label">{labels[s] || s}</span>
            <small className="tl-state">{i <= done ? (s === 'CLOSED' ? 'Kontak kelurahan jika ada kendala' : 'Selesai') : 'Menunggu'}</small>
          </div>
        </li>
      ))}
      {status === 'DITOLAK' && (
        <li className="done rejected">
          <span className="tl-dot" aria-hidden="true"></span>
          <div>
            <span className="tl-label">{labels.DITOLAK}</span>
            <small className="tl-state">Hubungi kelurahan untuk keterangan</small>
          </div>
        </li>
      )}
    </ol>
  );
}