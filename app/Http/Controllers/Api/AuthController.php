<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
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
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
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
        return url('/storage/uploads/'.$name);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(null, 204);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->userPayload($request->user())]);
    }

    public static function userPayload(User $user): array
    {
        $user->setAttribute('notif_unread', $user->notifications()->whereNull('read_at')->count());
        return $user->toArray();
    }
}