<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Throwable;

/**
 * Cache yang tidak pernah merobohkan request.
 *
 * - Offline/aman: bila backend cache (database/file/redis) rusak atau tabelnya
 *   belum dimigrasi, langsung jalankan query tanpa cache.
 * - Hanya nilai plain (array/null/skalar) yang boleh di-cache. Menyimpan model
 *   Eloquent mentah pernah menghasilkan baris serialisasi basi yang terbaca
 *   sebagai __PHP_Incomplete_Class dan merusak /api/profil & /api/hero.
 */
class CacheSafe
{
    public static function remember(string $key, int $ttl, callable $fn)
    {
        try {
            return Cache::remember($key, $ttl, $fn);
        } catch (Throwable) {
            return $fn();
        }
    }

    public static function forget(string $key): void
    {
        try {
            Cache::forget($key);
        } catch (Throwable) {
            // abaikan: halaman tetap jalan tanpa cache
        }
    }

    /**
     * Generasi cache konten publik. Disematkan ke kunci cache agar mutasi
     * admin (tambah/ubah/hapus) langsung terlihat tanpa menunggu TTL —
     * tanpa ini /berita dkk. menyajikan daftar basi hingga 10 menit.
     */
    public static function generation(string $key): int
    {
        try {
            $v = Cache::get($key);
            return $v === null ? 1 : max(1, (int) $v);
        } catch (Throwable) {
            return 1;
        }
    }

    public static function bump(string $key): void
    {
        try {
            Cache::put($key, self::generation($key) + 1, 86400 * 30);
        } catch (Throwable) {
            // abaikan
        }
    }
}
