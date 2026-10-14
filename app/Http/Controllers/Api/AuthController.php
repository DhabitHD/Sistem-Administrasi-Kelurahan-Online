<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\Notifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'required|digits:16|unique:users,nik',
            'kk' => 'required|digits:16',
            'alamat' => 'required|string',
            'wa' => 'required|string|max:20',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'ktp' => 'nullable|string',
        ]);

        $ktp = $data['ktp'] ?? null;
        if ($ktp !== null && str_starts_with($ktp, 'data:')) {
            $ktp = $this->storeDataUrl($ktp);
        }

        $user = User::create([
            'name' => $data['nama'],
            'nik' => $data['nik'],
            'kk' => $data['kk'],
            'alamat' => $data['alamat'],
            'wa' => $data['wa'],
            'email' => $data['email'] ?? null,
            'password' => $data['password'],
            'ktp' => $ktp,
            'role' => 'warga',
            'status' => 'PENDING',
        ]);

        ActivityLog::create(['user_id' => $user->id, 'text' => 'Pendaftaran akun diterima, menunggu verifikasi admin kelurahan']);

        // Email konfirmasi pendaftaran (di-queue; butuh `queue:work` + mailer terkonfigurasi).
        // Gagal mengantre email tidak boleh membatalkan pendaftaran — Notifier sudah menelan
        // dan mencatat errornya ke log.
        Notifier::notify($user, 'Terima kasih telah mendaftar di portal Kelurahan Betet. Pendaftaran Anda kini menunggu verifikasi admin kelurahan dan Anda akan menerima email kembali setelah diverifikasi.');

        return response()->json(['data' => ['nik' => $user->nik]], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'identity' => 'required|string',
            'password' => 'required|string',
        ]);

        $id = $request->identity;
        $user = User::where('nik', $id)->orWhere('email', strtolower($id))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identitas atau password salah.'], 401);
        }
        if ($user->status === 'PENDING') {
            return response()->json(['message' => 'Akun masih menunggu verifikasi admin kelurahan.'], 403);
        }
        if ($user->status === 'REJECTED') {
            return response()->json(['message' => 'Akun Anda ditolak. Hubungi kelurahan untuk keterangan.'], 403);
        }

        $token = $user->createToken(Str::slug($user->name).'-token')->plainTextToken;

        return response()->json(['data' => ['token' => $token, 'user' => $this->userPayload($user)]]);
    }

    private function storeDataUrl(string $dataUrl): ?string
    {
        if (!preg_match('#^data:image/(jpeg|png|webp);base64,#', $dataUrl, $m)) {
            throw ValidationException::withMessages(['ktp' => 'File KTP harus berupa gambar (jpeg/png/webp).']);
        }
        $bin = base64_decode(substr($dataUrl, (int) strpos($dataUrl, ',') + 1), true);
        if ($bin === false || $bin === '' || strlen($bin) > 500 * 1024) {
            throw ValidationException::withMessages(['ktp' => 'File KTP tidak valid atau melebihi 500 KB.']);
        }
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $name = 'anon_'.time().'_'.uniqid().'.'.$ext;
        Storage::disk('public')->put("uploads/{$name}", $bin);
        // Relative path, not url(). The API and the SPA are served from different
        // origins in dev, so an absolute URL is a cross-origin request that the CSP
        // img-src directive blocks, and it is not portable across environments.
        return '/storage/uploads/'.$name;
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(null, 204);
    }

    /** Cabut semua token milik user (mis. setelah perangkat hilang). */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        return response()->json(null, 204);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->userPayload($request->user())]);
    }

    /** Minta token reset via email. Selalu balas generik agar tak bocor enumerasi. */
    public function forgot(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => 'required|email|max:255']);
        $user = User::where('email', strtolower($data['email']))->first();
        if ($user) {
            $token = Str::random(64);
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')->upsert(
                [['email' => $user->email, 'token' => \Illuminate\Support\Facades\Hash::make($token), 'created_at' => now()]],
                ['email'],
                ['token', 'created_at']
            );
            try {
                \Illuminate\Support\Facades\Mail::to($user->email)->queue(new \App\Mail\StatusMail(
                    nama: $user->name,
                    pesan: "Token reset password Anda: {$token}. Berlaku 60 menit. Abaikan email ini bila Anda tidak memintanya.",
                ));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Gagal antre reset password: '.$e->getMessage());
            }
        }
        return response()->json(['data' => ['message' => 'Bila email terdaftar, token reset telah dikirim.']]);
    }

    public function reset(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'token' => 'required|string|min:10',
            'password' => 'required|string|min:8|confirmed',
        ]);
        $row = \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $data['email'])->first();
        if (!$row || !$row->created_at || now()->diffInMinutes($row->created_at) > 60) {
            return response()->json(['message' => 'Token tidak valid atau kedaluwarsa.'], 422);
        }
        if (!\Illuminate\Support\Facades\Hash::check($data['token'], $row->token)) {
            return response()->json(['message' => 'Token tidak valid atau kedaluwarsa.'], 422);
        }
        $user = User::where('email', $data['email'])->firstOrFail();
        $user->update(['password' => $data['password']]);
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
        $user->tokens()->delete();
        ActivityLog::create(['user_id' => $user->id, 'text' => 'Password direset via email']);
        return response()->json(['data' => ['message' => 'Password berhasil diubah. Silakan masuk.']]);
    }

    /**
     * Payload sesi untuk user yang sedang login (login, /auth/me, update profil).
     *
     * Sengaja tidak mengembalikan `ktp` (foto KTP): tidak pernah dibaca dari
     * sesi warga — halaman admin memakai endpoint admin tersendiri yang memilih
     * kolom eksplisit. `kk` dipertahankan karena ditampilkan WargaProfil.
     * Memangkasnya mengurangi PII yang mengendap di localStorage.
     */
    public static function userPayload(User $user): array
    {
        $user->setAttribute('notif_unread', $user->notifications()->whereNull('read_at')->count());
        return collect($user->toArray())->except(['ktp'])->all();
    }
}