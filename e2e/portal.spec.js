import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';

/* Was an absolute path into a different directory on one developer's desktop, so
   the suite could not run anywhere else. Resolve from this file instead. */
const KTP = fileURLToPath(new URL('../public/assets/placeholders/ktp-preview-placeholder.png', import.meta.url));
const PASS = 'rahasia123';

async function login(page, identity, password, expectPath) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/login');
  await page.locator('#identity').fill(identity);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /Masuk/ }).click();
  await page.waitForURL(new RegExp(expectPath));
}

test('preloader tampil lalu hilang (<1s) + logo', async ({ page }) => {
  await page.goto('/');
  const pl = page.locator('.preloader');
  await expect(pl).toBeVisible();
  await expect(pl.locator('img').first()).toBeVisible();
  await expect(pl).toHaveClass(/hidden/, { timeout: 12000 });
  await expect(pl).toBeHidden({ timeout: 10000 });
});

test('halaman publik: kartu berita/layanan/detail + cari', async ({ page }) => {
  await page.goto('/berita');
  await expect(page.locator('.news-thumb').first()).toBeVisible();
  await page.locator('a[href^="/berita/"]').first().click();
  await expect(page.locator('.article-page h1')).not.toBeEmpty();

  await page.goto('/layanan');
  await expect(page.locator('.service-card').first()).toBeVisible();
  await page.locator('.service-card a[href^="/layanan/"]').first().click();
  await expect(page.getByRole('heading', { name: 'Persyaratan' })).toBeVisible();

  await page.goto('/cari?q=restorasi');
  await expect(page.getByText('Restorasi Sumber Air').first()).toBeVisible();
});

test('guard arah login', async ({ page }) => {
  await page.goto('/warga');
  await page.waitForURL(/login/);
  await page.goto('/admin');
  await page.waitForURL(/login/);
});

test('alur lengkap warga: daftar -> verifikasi admin -> layanan -> notif -> profil', async ({ page }) => {
  const n = Date.now().toString().slice(-10).padStart(12, '0').slice(-12);
  const nik = '3571' + n;
  const kk = '3572' + n;
  const email = `e2e${n}@example.com`;

  // 1) registrasi
  await page.goto('/register');
  await page.locator('#nama').fill('E2E Warga');
  await page.locator('#nik').fill(nik);
  await page.locator('#kk').fill(kk);
  await page.locator('#alamat').fill('Jl. E2E No 4');
  await page.locator('#wa').fill('081700000001');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(PASS);
  await page.locator('#confirm').fill(PASS);
  await page.locator('#ktp').setInputFiles(KTP);
  await page.getByRole('button', { name: /Daftar Sekarang/ }).click();
  await expect(page.getByText('Menunggu Verifikasi')).toBeVisible();

  // 2) admin verifikasi
  await login(page, 'admin@betet.id', 'admin1234', '/admin');
  await page.goto('/admin/warga');
  await page.getByPlaceholder('Cari nama, NIK, email…').fill(nik);
  await page.getByText(new RegExp(nik)).first().waitFor();
  await page.getByRole('button', { name: /Setujui/ }).first().click();
  await expect(page.getByText(/diubah menjadi VERIFIED/)).toBeVisible();

  // 3) warga login + pengaduan + foto
  await login(page, nik, PASS, '/warga');
  await expect(page.getByText(/Selamat datang, E2E Warga/)).toBeVisible();
  await page.goto('/warga/pengaduan-baru');
  await page.locator('#title').fill('E2E lampu mati');
  await page.locator('#description').fill('Lampu belok gang sejak pekan lalu.');
  await page.locator('#rt').fill('1');
  await page.locator('#rw').fill('2');
  await page.locator('#gmaps_link').fill('https://maps.google.com/?q=test');
  /* MultiFileUpload renders id="photos" (PengaduanBaru.jsx:106). This selector
     never matched anything, so the upload step silently did nothing. */
  await page.locator('#photos').setInputFiles(KTP);
  await page.getByRole('button', { name: /Kirim Pengaduan/ }).click();
  await expect(page).toHaveURL(/pengaduan$/);
  await expect(page.getByText('E2E lampu mati').first()).toBeVisible();
  await expect(page.locator('.side-badge').first()).toBeVisible();

  // 4) ajukan surat
  await page.goto('/warga/surat-baru');
  await expect(page.locator('#jenis')).toBeVisible();
  await expect(page.locator('#jenis option').first()).not.toHaveCount(0, { timeout: 15000 });
  await page.locator('#description').fill('Keperluan bank E2E');
  await page.getByRole('button', { name: /Kirim Pengajuan/ }).click();
  await expect(page).toHaveURL(/surat$/);

  // 5) riwayat + tracking publik
  await page.goto('/warga/riwayat');
  await expect(page.getByText(/E2E lampu mati/)).toBeVisible();
  const label = await page.locator('.text-brand.fw-semibold').first().textContent();
  const code = label.split('·')[1].trim();
  await page.goto('/pelacakan');
  await page.locator('input[aria-label="Kode pengaduan atau surat"]').fill(code);
  await page.getByRole('button', { name: /Lacak/ }).click();
  await expect(page.getByText(new RegExp(code))).toBeVisible();

  // 6) notif mark-seen hilangkan badge
  await page.goto('/warga/notifikasi');
  await expect(page.locator('.activity').first()).toBeVisible();
  await expect(page.locator('.side-badge')).toHaveCount(0, { timeout: 15000 });

  // 7) profil
  await page.goto('/warga/profil');
  await page.locator('#wa').fill('081800000002');
  await page.locator('#email').fill(email);
  await page.locator('#alamat').fill('Jl. E2E Baru 9');
  await page.locator('input[accept="image/*"]').setInputFiles(KTP);
  await page.getByRole('button', { name: /Simpan Perubahan/ }).click();
  await expect(page.getByText('Data kontak berhasil diperbarui.')).toBeVisible();
  await expect(page.locator('.profile-avatar img')).toBeVisible();
});

test('CRUD berita admin -> tampil publik -> hilang', async ({ page }) => {
  await login(page, 'admin@betet.id', 'admin1234', '/admin');
  await page.goto('/admin/berita');
  const title = 'E2E Berita ' + Date.now().toString().slice(-6);
  await page.locator('#b-title').fill(title);
  await page.locator('#b-cat').fill('Informasi');
  await page.locator('#b-sum').fill('ringkasan E2E');
  await page.locator('#b-con').fill('paragraf satu\nparagraf dua');
  await page.getByRole('button', { name: /Terbitkan Berita/ }).click();
  await expect(page.getByText('Berita baru ditambahkan.')).toBeVisible();

  await page.goto('/berita');
  await expect(page.getByText(title).first()).toBeVisible();

  await page.goto('/admin/berita');
  page.on('dialog', (d) => d.accept());
  await page.locator('.dashboard-card', { hasText: title }).getByTitle('Hapus').click();
  await expect(page.getByText(title)).toHaveCount(0);
});