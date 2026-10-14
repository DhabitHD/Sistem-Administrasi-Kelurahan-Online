<?php

namespace App\Support;

/**
 * Helper kecil untuk query pencarian LIKE.
 *
 * Eloquent sudah memakai binding parameter, jadi ini BUKAN pertahanan SQL
 * injection — itu sudah aman. Yang dijaga adalah wildcard LIKE: karakter
 * '%' dan '_' dari input pengguna diperlakukan sebagai teks biasa, bukan
 * sebagai pola, supaya pencarian "100%" tidak mengembalikan seluruh tabel
 * dan pengguna tidak bisa menyusun pola yang memperlambat query.
 */
final class Like
{
    /** Escape wildcard '%' dan '_' (plus backslash-nya sendiri). */
    public static function escape(string $value): string
    {
        return addcslashes($value, '%_\\');
    }

    /** Bungkus pola contains: aman dipakai langsung di ->where(..., 'like', ...). */
    public static function contains(string $value): string
    {
        return '%'.self::escape($value).'%';
    }
}
