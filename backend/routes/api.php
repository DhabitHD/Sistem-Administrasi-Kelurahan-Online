<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Rute Publik (Tidak butuh token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rute Terlindungi (Wajib menyertakan Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute bawaan untuk mengambil data user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Nanti rute pengaduan, layanan surat, dll akan kita masukkan ke dalam blok ini
});