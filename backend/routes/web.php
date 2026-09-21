<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', fn () => view('welcome'));

Route::get('login', fn () => response()->json(['message' => 'Tidak terautentikasi.'], 401))->name('login');

Route::get('/storage/uploads/{file}', function (string $file) {
    $name = basename($file);
    $path = 'uploads/'.$name;
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    return response()->file(Storage::disk('public')->path($path));
});