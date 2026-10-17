<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\PrivateFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Menyajikan berkas privat (KTP, avatar warga) dari disk `local`.
 * Hanya pemilik berkas atau admin yang boleh mengakses.
 */
class FileController extends Controller
{
    public function show(Request $request, string $path): BinaryFileResponse
    {
        $relative = PrivateFile::localRelative($path);
        abort_unless($relative && Storage::disk('local')->exists($relative), 404);

        $me = $request->user();
        $mine = $me->ktp === $path || $me->avatar === $path;
        abort_unless($me->role === 'admin' || $mine, 403);

        return response()->file(Storage::disk('local')->path($relative));
    }
}
