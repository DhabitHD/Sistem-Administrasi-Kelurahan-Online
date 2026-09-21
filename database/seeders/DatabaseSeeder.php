<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Layanan;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@betet.id'],
            [
                'name' => 'Admin Kelurahan Betet',
                'nik' => '3571010101010101',
                'wa' => '081234567891',
                'alamat' => 'Kantor Kelurahan Betet, Kota Kediri',
                'password' => 'admin1234',
                'role' => 'admin',
                'status' => 'VERIFIED',
            ]
        );
        ActivityLog::updateOrCreate(
            ['user_id' => $admin->id, 'text' => 'Login pertama ke panel admin'],
            ['user_id' => $admin->id, 'text' => 'Login pertama ke panel admin']
        );

        $demo = User::updateOrCreate(
            ['nik' => '3571********1234'],
            [
                'name' => 'Budi Santoso',
                'kk' => '3571********1999',
                'email' => 'demo@betet.id',
                'wa' => '081234567890',
                'alamat' => 'Jl. Raya Betet Bawang 76, Kota Kediri',
                'password' => 'demo1234',
                'role' => 'warga',
                'status' => 'VERIFIED',
            ]
        );

        ActivityLog::updateOrCreate(
            ['user_id' => $demo->id, 'text' => 'Login ke dashboard warga'],
            ['user_id' => $demo->id, 'text' => 'Login ke dashboard warga']
        );

        foreach ($this->berita() as $b) {
            \App\Models\Berita::updateOrCreate(['slug' => $b['slug']], $b);
        }
        foreach ($this->pengumuman() as $p) {
            \App\Models\Pengumuman::updateOrCreate(['slug' => $p['slug']], $p);
        }
        foreach ($this->layanan() as $l) {
            Layanan::updateOrCreate(['slug' => $l['slug']], $l);
        }
        foreach ($this->dokumen() as $d) {
            \App\Models\Dokumen::updateOrCreate(['slug' => $d['slug']], $d);
        }

        foreach ($this->perangkat() as $p) {
            \App\Models\Perangkat::updateOrCreate(['slug' => $p['slug']], $p);
        }

        \App\Models\Video::updateOrCreate(
            ['slug' => 'video-profil-kelurahan'],
            ['title' => 'Video Profil Kelurahan Betet', 'video' => 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 'desc' => 'Video contoh — ganti dengan tautan video resmi kelurahan.', 'is_active' => true, 'order' => 1]
        );
        \App\Models\Video::updateOrCreate(
            ['slug' => 'kegiatan-warga'],
            ['title' => 'Kegiatan Warga', 'video' => 'https://www.youtube.com/watch?v=ScMzIvxCSiU', 'desc' => 'Dokumentasi kegiatan — ganti dengan tautan resmi.', 'is_active' => true, 'order' => 2]
        );

        \App\Models\Profil::updateOrCreate(
            ['id' => 1],
            [
                'nama_lurah' => 'Zainudin Budi Wibowo, S.E.',
                'foto_lurah' => '/assets/placeholders/foto-lurah.jpg',
                'struktur_image' => '/assets/placeholders/struktur-pemerintahan.jpg',
                'struktur_desc' => 'Struktur organisasi Kelurahan Betet dipimpin oleh lurah dan dibantu oleh sekretaris kelurahan serta tiga seksi pelayanan, mengikuti ketentuan organisasi perangkat daerah.',
                'visi' => 'Mewujudkan Kelurahan Betet yang maju, mandiri, tertib, dan sejahtera dengan pelayanan publik yang mudah diakses serta partisipasi masyarakat yang kuat.',
                'misi' => [
                    'Meningkatkan kualitas pelayanan publik.',
                    'Memperkuat keterbukaan informasi.',
                    'Mendorong pemberdayaan masyarakat.',
                    'Menjaga lingkungan yang aman, bersih, dan nyaman.',
                    'Mengembangkan potensi wilayah dan kolaborasi warga.',
                ],
                'sambutan' => [
                    'Website ini menjadi salah satu media informasi dan pelayanan publik untuk membantu warga mendapatkan informasi dengan lebih cepat dan mudah.',
                    'Kami mengajak seluruh warga untuk memanfaatkan kanal digital ini — mulai dari informasi kegiatan, pengaduan, hingga pengajuan surat.',
                ],
                'kontak_alamat' => 'Jl. Raya Betet Bawang 76, Kota Kediri, Jawa Timur',
                'kontak_telp' => '(0354) 682955',
                'kontak_email' => 'diskominfo@kedirikota.go.id',
                'kontak_jam' => 'Senin–Kamis 08.00–15.00 WIB · Jumat 07.00–14.00 WIB',
            ]
        );

        $hint = 'Akun demo di-reset seed. Warga: 3571********1234 / demo1234 · Admin: admin@betet.id / admin1234';
        Notification::updateOrCreate(
            ['user_id' => $demo->id, 'message' => $hint],
            ['user_id' => $demo->id, 'message' => $hint]
        );

        $heroSlides = [
            ['/assets/placeholders/hero-banner.jpg', 'WEBSITE RESMI KELURAHAN BETET', 'Selamat Datang di Website ', 'Kelurahan Betet', 'Sumber informasi terbaru tentang pemerintahan dan pelayanan di Kelurahan Betet, Kota Kediri.'],
            ['/assets/placeholders/struktur-pemerintahan.jpg', 'PELAYANAN PUBLIK', 'Pengajuan Surat Kini Bisa ', 'Online', 'Warga terdaftar dapat mengajukan surat keterangan kelurahan tanpa harus antre di loket.'],
            ['/assets/placeholders/foto-lurah.jpg', 'KANAL PENGADUAN', 'Sampaikan Pengaduan dengan ', 'Mudah', 'Laporkan kendala layanan atau lingkungan dan pantau statusnya secara real-time.'],
        ];
        foreach ($heroSlides as $i => [$image, $kicker, $before, $span, $lead]) {
            \App\Models\HeroSlide::updateOrCreate(
                ['order' => $i + 1],
                ['image' => $image, 'kicker' => $kicker, 'title_before' => $before, 'title_span' => $span, 'lead' => $lead, 'is_active' => true],
            );
        }
    }

    private function content(string $slug, string $date, string $title, string $summary, string $image, array $content, ?string $categoria = null): array
    {
        return [
            'slug' => $slug,
            'date' => $date,
            ...($categoria !== null ? ['category' => $categoria] : []),
            'title' => $title,
            'summary' => $summary,
            'image' => $image,
            'content' => $content,
        ];
    }

    private function berita(): array
    {
        return [
            $this->content('restorasi-sumber-air', '1 September 2026', 'Restorasi Sumber Air', 'Program pelestarian dan perawatan area sumber air melalui penanaman dan perawatan lingkungan.', '/assets/placeholders/berita-1.jpg', ['Kelurahan Betet mendorong pelestarian sumber air melalui kegiatan penghijauan dan perawatan area sekitar sumber.', 'Program ini menempatkan kolaborasi warga dan mahasiswa sebagai bagian penting dari perawatan lingkungan secara berkelanjutan.'], 'Lingkungan'),
            $this->content('selamat-hari-pramuka', '14 Agustus 2026', 'Selamat Hari Pramuka', 'Kelurahan Betet menyampaikan ucapan dan semangat pengabdian pada momentum Hari Pramuka.', '/assets/placeholders/berita-2.jpg', ['Momentum Hari Pramuka menjadi pengingat pentingnya gotong royong, kedisiplinan, dan kepedulian terhadap lingkungan sekitar.'], 'Kegiatan'),
            $this->content('kunjungan-farmliving', '10 Agustus 2026', 'Kunjungan Farmliving', 'Kegiatan kunjungan dan pembelajaran yang berkaitan dengan pemanfaatan potensi lingkungan dan masyarakat.', '/assets/placeholders/berita-3.jpg', ['Kunjungan menjadi ruang bertukar pengalaman untuk mengembangkan potensi lokal dan kegiatan produktif masyarakat.'], 'Pemberdayaan'),
            $this->content('perpisahan-mahasiswa-kknt-34-unp', '7 Agustus 2026', 'Perpisahan Mahasiswa KKNT-34 UNP PGRI', 'Momen penutupan kegiatan mahasiswa dan kolaborasi bersama masyarakat Kelurahan Betet.', '/assets/placeholders/berita-1.jpg', ['Kegiatan perpisahan menjadi bagian dari rangkaian kolaborasi mahasiswa dengan warga dan pemerintah kelurahan.'], 'Kegiatan'),
            $this->content('penerimaan-mahasiswa-kkn', '1 Agustus 2026', 'Penerimaan Mahasiswa KKN', 'Kelurahan Betet menerima dan mendukung kegiatan mahasiswa KKN sebagai bagian dari kolaborasi dengan masyarakat.', '/assets/placeholders/berita-2.jpg', ['Kolaborasi mahasiswa dan masyarakat diharapkan menghadirkan kegiatan yang relevan dengan kebutuhan lingkungan dan warga.'], 'Pendidikan'),
        ];
    }

    private function pengumuman(): array
    {
        return [
            $this->content('libur-hari-buruh-2026', '1 Mei 2026', 'Pemberitahuan Libur Hari Buruh Internasional', 'Pelayanan kantor Kelurahan Betet menyesuaikan hari libur dan kembali pada hari kerja berikutnya.', '/assets/placeholders/pengumuman-1.jpg', ['Kantor Kelurahan Betet tutup pada periode libur yang diumumkan dan membuka kembali pelayanan pada jadwal kerja berikutnya.']),
            $this->content('libur-hari-besar-2026', '16 Juni 2026', 'Pemberitahuan Libur Hari Besar', 'Informasi penyesuaian jadwal pelayanan kantor pada libur hari besar.', '/assets/placeholders/pengumuman-2.jpg', ['Warga dapat memeriksa jadwal terbaru sebelum datang ke kantor kelurahan.']),
            $this->content('libur-kenaikan-yesus-kristus-2026', '14 Mei 2026', 'Pengumuman Libur dan Cuti Bersama', 'Pelayanan kantor menyesuaikan libur Hari Besar Kenaikan Yesus Kristus dan cuti bersama.', '/assets/placeholders/pengumuman-1.jpg', ['Pelayanan dibuka kembali pada hari kerja berikutnya sesuai pengumuman resmi.']),
            $this->content('pemeliharaan-sistem-online', '6 Juni 2026', 'Pemberitahuan Pemeliharaan Sistem Layanan Online', 'Pemeliharaan dilakukan untuk menjaga stabilitas layanan informasi digital.', '/assets/placeholders/pengumuman-2.jpg', ['Beberapa fitur dapat mengalami jeda akses selama pemeliharaan.']),
        ];
    }

    private function dokumen(): array
    {
        return [
            [
                'slug' => 'profil-kelurahan-betet',
                'title' => 'Profil Kelurahan Betet',
                'category' => 'DOKUMEN',
                'desc' => 'Dokumen profil kelurahan untuk informasi umum dan layanan.',
                'icon' => 'file-earmark-text',
                'file' => null,
                'content' => ['Gambaran umum Kelurahan Betet, Kecamatan Pesantren, Kota Kediri.', 'Lingkup tugas, pelayanan, dan data kependudukan kelurahan.'],
                'date' => '1 September 2026',
            ],
            [
                'slug' => 'potensi-kelurahan-betet',
                'title' => 'Potensi Kelurahan Betet',
                'category' => 'DOKUMEN',
                'desc' => 'Dokumen yang memuat potensi wilayah dan masyarakat.',
                'icon' => 'map',
                'file' => null,
                'content' => ['Potensi sumber daya alam dan manusia yang dapat dikembangkan.', 'Peluang pemberdayaan dan kemitraan bersama masyarakat.'],
                'date' => '1 September 2026',
            ],
            [
                'slug' => 'kelompok-informasi-masyarakat',
                'title' => 'Kelompok Informasi Masyarakat',
                'category' => 'INFORMASI',
                'desc' => 'Materi informasi dan komunikasi masyarakat.',
                'icon' => 'people',
                'file' => null,
                'content' => ['Kelompok Informasi Masyarakat (KIM) menjadi wadah literasi dan diseminasi informasi tingkat kelurahan.', 'Kegiatan KIM bertujuan mempercepat akses warga terhadap informasi publik.'],
                'date' => '1 September 2026',
            ],
            [
                'slug' => 'city-board-applications',
                'title' => 'City Board Applications',
                'category' => 'DOKUMEN',
                'desc' => 'Koleksi dokumen/informasi publik yang ditampilkan pada portal.',
                'icon' => 'grid-3x3-gap',
                'file' => null,
                'content' => ['Kumpulan informasi publik kelurahan yang dapat diakses warga.'],
                'date' => '1 September 2026',
            ],
        ];
    }

    private function perangkat(): array
    {
        $rows = [
            ['Lurah', 'Zainudin Budi Wibowo, S.E'],
            ['Sekretaris Kelurahan', 'Kustriwi Widyasari, S.Sos., MM'],
            ['Staf', 'Agus Dwi Cahyono'],
            ['Staf', 'Irwan Susanto'],
            ['Seksi Pemerintahan dan Pelayanan Umum', 'Diah Trisnaningrum, S.H'],
            ['Staf', 'Sofiyah'],
            ['Seksi Trantib Umum dan Kesejahteraan Masyarakat', 'Dewi Kamil Masruroh, S.E.'],
            ['Staf', 'Dwi Deskawati'],
            ['Staf', 'Hano Citra Wibawa'],
            ['Seksi Ekbang dan Pemberdayaan Masyarakat', 'Wisnu Bagus Raharjo, S.T.'],
        ];
        return array_map(fn ($i, $r) => [
            'slug' => \Illuminate\Support\Str::slug($r[1].'-'.$r[0]),
            'role' => $r[0],
            'name' => $r[1],
            'photo' => null,
            'order' => $i,
        ], array_keys($rows), $rows);
    }

    private function layanan(): array
    {
        $items = [
            ['perubahan-data-kk-ktp', 'file-pen-line', 'Perubahan Data KK & KTP', 'Informasi persyaratan dan alur perubahan data pada dokumen kependudukan.', ['Kartu Keluarga (KK)', 'KTP', 'Materai', 'Dokumen pendukung bila diperlukan', 'Surat pengantar RT/RW'], 'Pemeriksaan kelengkapan berkas, verifikasi data, lalu proses administrasi sesuai alur pelayanan kependudukan.'],
            ['surat-kematian', 'cross', 'Surat Kematian', 'Layanan informasi administrasi untuk pencatatan peristiwa kematian warga.', ['KTP/KK', 'Dokumen kematian dari fasilitas kesehatan atau keterangan terkait', 'Surat pengantar RT/RW'], 'Verifikasi dokumen dan penerbitan dokumen pengantar sesuai kebutuhan warga.'],
            ['surat-kelahiran', 'baby', 'Surat Kelahiran', 'Informasi pengurusan dokumen administrasi kelahiran warga.', ['Kartu Keluarga', 'Surat keterangan kelahiran', 'KTP orang tua', 'Surat pengantar bila diperlukan'], 'Pemeriksaan dokumen dan pengantar administrasi kependudukan.'],
            ['kia', 'id-card', 'KIA (Kartu Identitas Anak)', 'Informasi persyaratan dan proses layanan Kartu Identitas Anak.', ['Kartu Keluarga', 'Akta kelahiran', 'Dokumen orang tua/wali bila diperlukan'], 'Verifikasi data anak dan kelengkapan dokumen sebelum diteruskan sesuai prosedur.'],
            ['kk-ktp', 'scan-text', 'KK & KTP', 'Akses informasi layanan administrasi Kartu Keluarga dan KTP.', ['Kartu Keluarga', 'KTP', 'Dokumen perubahan bila ada'], 'Pemeriksaan berkas dan penerbitan/pengantar sesuai jenis kebutuhan administrasi.'],
            ['surat-keterangan-usaha', 'store', 'Surat Keterangan Usaha', 'Surat keterangan bagi warga yang menjalankan kegiatan usaha.', ['KTP', 'Kartu Keluarga', 'Data usaha'], 'Verifikasi data usaha dan penerbitan surat keterangan.'],
            ['surat-keterangan-domisili', 'map-pin-house', 'Surat Keterangan Domisili', 'Surat keterangan tempat tinggal untuk keperluan administrasi warga.', ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'], 'Verifikasi data tempat tinggal dan penerbitan surat keterangan.'],
            ['surat-keterangan-tidak-mampu', 'hand-thumbs-up', 'Surat Keterangan Tidak Mampu', 'Surat keterangan untuk keperluan bantuan sosial atau keringanan biaya.', ['KTP', 'Kartu Keluarga', 'Surat pengantar RT/RW'], 'Verifikasi kondisi ekonomi dan penerbitan surat keterangan.'],
        ];

        return array_map(fn ($i) => [
            'slug' => $i[0],
            'icon' => $i[1],
            'name' => $i[2],
            'short' => $i[3],
            'requirements' => $i[4],
            'process' => $i[5],
        ], $items);
    }
}