<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validasi ketat input dari Front-End
        $validator = Validator::make($request->all(), [
            'nik' => 'required|string|size:16|unique:users',
            'nama_lengkap' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' mensyaratkan input 'password_confirmation' dari FE
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'agama' => 'required|string',
            'pekerjaan' => 'required|string',
            'alamat_lengkap' => 'required|string',
            'nomor_hp' => 'required|string|max:20',
            'foto_ktp' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Maksimal 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Simpan file foto KTP ke folder storage lokal
        $fotoPath = $request->file('foto_ktp')->store('ktp', 'public');

        // 3. Simpan data ke database (Role dan Status otomatis default dari migration)
        $user = User::create(array_merge(
            $validator->validated(),
            [
                'password' => Hash::make($request->password), // Enkripsi password
                'foto_ktp' => $fotoPath,
                'no_kk' => $request->no_kk, // Opsional
                'nomor_rumah' => $request->nomor_rumah, // Opsional
                'email' => $request->email, // Opsional
            ]
        ));

        // 4. Berikan respon sukses sesuai rancangan Sequence Diagram
        return response()->json([
            'message' => 'Pendaftaran Berhasil, Cek Status Berkala',
            'data' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'nik' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Cari user berdasarkan NIK
        $user = User::where('nik', $request->nik)->first();

        // 3. Cek apakah user ada dan password cocok
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'NIK atau Password salah.'
            ], 401);
        }

        // 4. Aturan PRD: Pastikan status akun sudah VERIFIED
        if ($user->status_akun !== 'VERIFIED') {
            return response()->json([
                'message' => 'Akun Anda belum diverifikasi oleh Admin atau pendaftaran ditolak.'
            ], 403);
        }

        // 5. Buat token akses Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'data' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan untuk request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}