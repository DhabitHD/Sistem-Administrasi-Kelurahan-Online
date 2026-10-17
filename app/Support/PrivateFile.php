<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * Berkas identitas (KTP, avatar warga) tinggal di disk `local`
 * (storage/app/private) yang TIDAK di-symlink ke publik, dan hanya
 * disajikan lewat endpoint GET /api/files/... ber-auth.
 *
 * Path yang disimpan di DB berbentuk 'private/uploads/nama.ext'.
 * delete() juga memahami prefix lawas '/storage/uploads/...' agar
 * migrasi dan pembersihan tetap jalan selama masa transisi.
 */
final class PrivateFile
{
    public static function storeDataUrl(string $dataUrl, string $prefix = 'anon'): string
    {
        if (!preg_match('#^data:image/(jpeg|png|webp);base64,#', $dataUrl, $m)) {
            throw ValidationException::withMessages(['file' => 'File harus berupa gambar (jpeg/png/webp).']);
        }
        $bin = base64_decode(substr($dataUrl, (int) strpos($dataUrl, ',') + 1), true);
        if ($bin === false || $bin === '' || strlen($bin) > 500 * 1024) {
            throw ValidationException::withMessages(['file' => 'File tidak valid atau melebihi 500 KB.']);
        }
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $name = $prefix.'_'.time().'_'.uniqid().'.'.$ext;
        Storage::disk('local')->put("uploads/{$name}", $bin);

        return 'private/uploads/'.$name;
    }

    public static function delete(?string $path): void
    {
        if (!$path) {
            return;
        }
        if (str_starts_with($path, 'private/uploads/')) {
            Storage::disk('local')->delete(substr($path, strlen('private/')));
        } elseif (str_starts_with($path, '/storage/uploads/')) {
            Storage::disk('public')->delete(substr($path, strlen('/storage/')));
        }
    }

    /** Normalisasi path DB menjadi relatif terhadap disk local, atau null bila bukan berkas privat. */
    public static function localRelative(?string $path): ?string
    {
        if ($path && preg_match('#^private/uploads/[A-Za-z0-9_][A-Za-z0-9_.-]*$#', $path)) {
            return substr($path, strlen('private/'));
        }

        return null;
    }
}
