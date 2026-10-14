import { test, expect } from '@playwright/test';

/* Alur auth kritis: guard, login gagal/berhasil, logout, validasi reset.
   Memakai akun demo dari seeder (idempotent): warga 3571********1234/demo1234,
   admin admin@betet.id/admin1234. Backend harus jalan di :8000 (proxy /api). */

async function login(page, identity, password, expectPath) {
  await page.goto('/login');
  await page.getByLabel(/NIK \/ Email/i).fill(identity);
  await page.getByLabel(/^Password/i).fill(password);
  await page.getByRole('button', { name: /Masuk/ }).click();
  await page.waitForURL(new RegExp(expectPath));
}

test('guard: /warga tanpa login dialihkan ke /login', async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/warga');
  await expect(page).toHaveURL(/\/login/);
});

test('guard: /admin oleh warga dialihkan ke /warga', async ({ page }) => {
  await page.context().clearCookies();
  await login(page, '3571********1234', 'demo1234', '/warga');
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/warga/);
});

test('login salah tidak membuat sesi', async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.getByLabel(/NIK \/ Email/i).fill('3571********1234');
  await page.getByLabel(/^Password/i).fill('salah123');
  await page.getByRole('button', { name: /Masuk/ }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test('warga login → dashboard → logout', async ({ page }) => {
  await page.context().clearCookies();
  await login(page, '3571********1234', 'demo1234', '/warga');
  await expect(page.getByRole('heading', { name: /Selamat datang/i })).toBeVisible();
  await page.goto('/warga/profil');
  await expect(page.getByRole('heading', { name: /Profil Saya/ })).toBeVisible();
});

test('admin login → panel admin + stats', async ({ page }) => {
  await page.context().clearCookies();
  await login(page, 'admin@betet.id', 'admin1234', '/admin');
  await expect(page.getByRole('heading', { name: /Dashboard Admin/ })).toBeVisible();
});

test('reset-password: validasi client min 8 + konfirmasi', async ({ page }) => {
  await page.context().clearCookies();
  await page.goto('/reset-password');
  await page.getByLabel(/Email/i).fill('demo@betet.id');
  await page.getByLabel(/Token/i).fill('token-salah');
  await page.getByLabel(/Password baru/i).fill('pendek');
  await page.getByLabel(/Konfirmasi/i).fill('beda');
  await page.getByRole('button', { name: /Reset password/i }).click();
  await expect(page.getByRole('alert').first()).toContainText(/8 karakter|tidak sama/i);
});
