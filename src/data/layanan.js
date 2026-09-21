export const layanan = [
  {
    slug: 'perubahan-data-kk-ktp',
    icon: 'file-pen-line',
    name: 'Perubahan Data KK & KTP',
    short: 'Informasi persyaratan dan alur perubahan data pada dokumen kependudukan.',
    requirements: ['Kartu Keluarga (KK)', 'KTP', 'Materai', 'Dokumen pendukung bila diperlukan', 'Surat pengantar RT/RW'],
    process: 'Pemeriksaan kelengkapan berkas, verifikasi data, lalu proses administrasi sesuai alur pelayanan kependudukan.'
  },
  {
    slug: 'surat-kematian',
    icon: 'cross',
    name: 'Surat Kematian',
    short: 'Layanan informasi administrasi untuk pencatatan peristiwa kematian warga.',
    requirements: ['KTP/KK', 'Dokumen kematian dari fasilitas kesehatan atau keterangan terkait', 'Surat pengantar RT/RW'],
    process: 'Verifikasi dokumen dan penerbitan dokumen pengantar sesuai kebutuhan warga.'
  },
  {
    slug: 'surat-kelahiran',
    icon: 'baby',
    name: 'Surat Kelahiran',
    short: 'Informasi pengurusan dokumen administrasi kelahiran warga.',
    requirements: ['Kartu Keluarga', 'Surat keterangan kelahiran', 'KTP orang tua', 'Surat pengantar bila diperlukan'],
    process: 'Pemeriksaan dokumen dan pengantar administrasi kependudukan.'
  },
  {
    slug: 'kia',
    icon: 'id-card',
    name: 'KIA (Kartu Identitas Anak)',
    short: 'Informasi persyaratan dan proses layanan Kartu Identitas Anak.',
    requirements: ['Kartu Keluarga', 'Akta kelahiran', 'Dokumen orang tua/wali bila diperlukan'],
    process: 'Verifikasi data anak dan kelengkapan dokumen sebelum diteruskan sesuai prosedur.'
  },
  {
    slug: 'kk-ktp',
    icon: 'scan-text',
    name: 'KK & KTP',
    short: 'Akses informasi layanan administrasi Kartu Keluarga dan KTP.',
    requirements: ['Kartu Keluarga', 'KTP', 'Dokumen perubahan bila ada'],
    process: 'Pemeriksaan berkas dan penerbitan/pengantar sesuai jenis kebutuhan administrasi.'
  },
  {
    slug: 'surat-keterangan-usaha',
    icon: 'store',
    name: 'Surat Keterangan Usaha',
    short: 'Surat keterangan bagi warga yang menjalankan kegiatan usaha.',
    requirements: ['KTP', 'Kartu Keluarga', 'Data usaha'],
    process: 'Verifikasi data usaha dan penerbitan surat keterangan.'
  },
  {
    slug: 'surat-keterangan-domisili',
    icon: 'map-pin-house',
    name: 'Surat Keterangan Domisili',
    short: 'Surat keterangan tempat tinggal untuk keperluan administrasi warga.',
    requirements: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
    process: 'Verifikasi data tempat tinggal dan penerbitan surat keterangan.'
  },
  {
    slug: 'surat-keterangan-tidak-mampu',
    icon: 'hand-thumbs-up',
    name: 'Surat Keterangan Tidak Mampu',
    short: 'Surat keterangan untuk keperluan bantuan sosial atau keringanan biaya.',
    requirements: ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'],
    process: 'Verifikasi kondisi ekonomi dan penerbitan surat keterangan.'
  },
];