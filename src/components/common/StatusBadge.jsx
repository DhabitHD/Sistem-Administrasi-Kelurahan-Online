const statusMap = {
  PENDING:       ['Menunggu',        'warning'],
  IN_PROGRESS:   ['Sedang Diproses', 'info'],
  CLOSED:        ['Selesai',         'success'],
  DIAJUKAN:      ['Diajukan',        'secondary'],
  SIAP_DIAMBIL:  ['Siap Diambil',    'success'],
  DITOLAK:       ['Ditolak',         'danger'],
  VERIFIED:      ['Terverifikasi',   'success'],
  REJECTED:      ['Ditolak',         'danger'],
};

export default function StatusBadge({ status }) {
  const [label, tone] = statusMap[status] || ['Status Tidak Dikenal', 'secondary'];

  return (
    <span className={`badge rounded-pill status-badge text-bg-${tone}`}>
      <span className="status-dot dots-tonal" aria-hidden="true"></span>
      {label}
    </span>
  );
}