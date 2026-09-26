<?php

use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\TugasController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\WargaController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::get('berita', [PublicController::class, 'berita']);
Route::get('berita/{slug}', [PublicController::class, 'beritaShow']);
Route::get('pengumuman', [PublicController::class, 'pengumuman']);
Route::get('pengumuman/{slug}', [PublicController::class, 'pengumumanShow']);
Route::get('layanan', [PublicController::class, 'layanan']);
Route::get('layanan/{slug}', [PublicController::class, 'layananShow']);
Route::get('dokumen', [PublicController::class, 'dokumen']);
Route::get('dokumen/{slug}', [PublicController::class, 'dokumenShow']);
Route::get('perangkat', [PublicController::class, 'perangkat']);
Route::get('videos', [PublicController::class, 'videos']);
Route::get('cari', [PublicController::class, 'cari']);
Route::post('visits', [PublicController::class, 'visits']);
Route::get('hero', [HeroController::class, 'public']);
Route::get('profil', [ProfilController::class, 'public']);
/* Public (no auth) — status lookup only. Throttled because id_code is a
   sequential counter and the response is unauthenticated by design. */
Route::get('tracking/{code}', [WargaController::class, 'tracking'])->middleware('throttle:30,1');

Route::get('tugas/{token}', [TugasController::class, 'show']);
Route::post('tugas/{token}/laporan', [TugasController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('upload', [UploadController::class, 'store']);

    Route::get('pengaduan', [WargaController::class, 'complaintsIndex']);
    Route::post('pengaduan', [WargaController::class, 'complaintsStore']);
    Route::get('pengaduan/{id}', [WargaController::class, 'complaintsShow']);
    Route::get('surat', [WargaController::class, 'lettersIndex']);
    Route::post('surat', [WargaController::class, 'lettersStore']);
    Route::get('surat/{id}', [WargaController::class, 'lettersShow']);

    Route::patch('warga/profil', [WargaController::class, 'updateProfile']);
    Route::get('notifikasi', [WargaController::class, 'notifications']);
    Route::post('notifikasi/seen', [WargaController::class, 'notificationsSeen']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('warga', [AdminController::class, 'wargaIndex']);
    Route::patch('warga/{nik}/status', [AdminController::class, 'wargaStatus']);
    Route::get('pengaduan', [AdminController::class, 'complaintsAll']);
    Route::patch('pengaduan/{id}/status', [AdminController::class, 'statusComplaint']);
    Route::post('pengaduan/{id}/tutup', [AdminController::class, 'closeComplaint']);
    Route::patch('pengaduan/{id}/petugas', [AdminController::class, 'assignOfficer']);
    Route::get('surat', [AdminController::class, 'lettersAll']);
    Route::patch('surat/{id}/status', [AdminController::class, 'statusLetter']);
    Route::get('stats', [AdminController::class, 'stats']);
    Route::get('officers', [AdminController::class, 'officersIndex']);
    Route::post('officers', [AdminController::class, 'officersStore']);
    Route::put('officers/{id}', [AdminController::class, 'officersUpdate']);
    Route::delete('officers/{id}', [AdminController::class, 'officersDestroy']);
    Route::get('admins', [AdminController::class, 'adminsIndex']);
    Route::post('admins', [AdminController::class, 'adminsStore']);
    Route::put('admins/{id}', [AdminController::class, 'adminsUpdate']);
    Route::delete('admins/{id}', [AdminController::class, 'adminsDestroy']);
    Route::get('profil', [ProfilController::class, 'adminShow']);
    Route::put('profil/{id}', [ProfilController::class, 'adminUpdate']);
    Route::get('hero', [HeroController::class, 'index']);
    Route::post('hero', [HeroController::class, 'store']);
    Route::put('hero/{id}', [HeroController::class, 'update']);
    Route::delete('hero/{id}', [HeroController::class, 'destroy']);

    Route::get('{kind}', [AdminContentController::class, 'index']);
    Route::post('{kind}', [AdminContentController::class, 'store']);
    Route::get('{kind}/{slug}', [AdminContentController::class, 'show']);
    Route::put('{kind}/{slug}', [AdminContentController::class, 'update']);
    Route::delete('{kind}/{slug}', [AdminContentController::class, 'destroy']);
});

Route::get('/user', function (Illuminate\Http\Request $request) {
    return $request->user();
})->middleware('auth:sanctum');