<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function public(): JsonResponse
    {
        return response()->json(['data' => Profil::first()]);
    }

    public function adminShow(): JsonResponse
    {
        return response()->json(['data' => Profil::first()]);
    }

    public function adminUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nama_lurah' => 'nullable|string|max:255',
            'foto_lurah' => 'nullable|string',
            'struktur_image' => 'nullable|string',
            'struktur_desc' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|array',
            'sambutan' => 'nullable|array',
            'kontak_alamat' => 'nullable|string|max:255',
            'kontak_telp' => 'nullable|string|max:50',
            'kontak_email' => 'nullable|string|max:255',
            'kontak_jam' => 'nullable|string|max:255',
        ]);
        $profil = Profil::firstOrNew(['id' => $id]);
        $profil->fill($data);
        $profil->save();
        return response()->json(['data' => $profil]);
    }
}