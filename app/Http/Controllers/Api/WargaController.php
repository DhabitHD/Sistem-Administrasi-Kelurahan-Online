<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Letter;
use App\Services\Notifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WargaController extends Controller
{
    public function complaintsIndex(Request $request): JsonResponse
    {
        $perPage = max(1, min(100, (int) $request->query('per_page', 15)));
        if ($request->query('page') || $request->query('per_page')) {
            $p = $request->user()->complaints()->orderByDesc('created_at')->paginate($perPage);
            return response()->json(['data' => $p->items(), 'meta' => [
                'current_page' => $p->currentPage(), 'last_page' => $p->lastPage(),
                'per_page' => $p->perPage(), 'total' => $p->total(),
            ]]);
        }
        $items = $request->user()->complaints()->orderByDesc('created_at')->limit(200)->get();
        return response()->json(['data' => $items]);
    }

    public function complaintsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'rt' => 'required|integer|between:1,99',
            'rw' => 'required|integer|between:1,99',
            'gmaps_link' => 'nullable|url|max:500',
            'photo' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'string',
        ]);

        $complaint = $request->user()->complaints()->create([
            'id_code' => $this->nextCode(Complaint::class, 'PGD'),
            'title' => $data['title'],
            'category' => $data['category'],
            'description' => $data['description'],
            'rt' => $data['rt'],
            'rw' => $data['rw'],
            'gmaps_link' => $data['gmaps_link'] ?? null,
            'photo' => $data['photo'] ?? null,
            'photos' => $data['photos'] ?? null,
            'status' => 'DIAJUKAN',
            'token' => Str::random(40),
        ]);

        $this->notify($request->user(), "Pengaduan {$complaint->id_code} diajukan: {$complaint->title}");

        return response()->json(['data' => $complaint], 201);
    }

    public function complaintsShow(Request $request, int $id): JsonResponse
    {
        $c = $request->user()->complaints()->findOrFail($id);
        return response()->json(['data' => $c]);
    }

    /** Warga boleh edit pengaduan miliknya selama masih DIAJUKAN. */
    public function complaintsUpdate(Request $request, int $id): JsonResponse
    {
        $c = $request->user()->complaints()->findOrFail($id);
        if ($c->status !== 'DIAJUKAN') {
            return response()->json(['message' => 'Hanya pengaduan berstatus DIAJUKAN yang bisa diubah.'], 422);
        }
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'rt' => 'required|integer|between:1,99',
            'rw' => 'required|integer|between:1,99',
            'gmaps_link' => 'nullable|url|max:500',
            'photo' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'string',
        ]);
        $c->update($data);
        return response()->json(['data' => $c]);
    }

    /** Pembatalan oleh warga = tandai DITOLAK milik sendiri (tidak hapus fisik). */
    public function complaintsCancel(Request $request, int $id): JsonResponse
    {
        $c = $request->user()->complaints()->findOrFail($id);
        if (in_array($c->status, ['CLOSED', 'DITOLAK'], true)) {
            return response()->json(['message' => 'Pengaduan sudah selesai, tidak bisa dibatalkan.'], 422);
        }
        $c->update(['status' => 'DITOLAK']);
        $this->notify($request->user(), "Pengaduan {$c->id_code} dibatalkan oleh Anda.");
        return response()->json(['data' => $c]);
    }

    public function lettersIndex(Request $request): JsonResponse
    {
        $perPage = max(1, min(100, (int) $request->query('per_page', 15)));
        if ($request->query('page') || $request->query('per_page')) {
            $p = $request->user()->letters()->orderByDesc('created_at')->paginate($perPage);
            return response()->json(['data' => $p->items(), 'meta' => [
                'current_page' => $p->currentPage(), 'last_page' => $p->lastPage(),
                'per_page' => $p->perPage(), 'total' => $p->total(),
            ]]);
        }
        $items = $request->user()->letters()->orderByDesc('created_at')->limit(200)->get();
        return response()->json(['data' => $items]);
    }

    public function lettersStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'jenis' => 'required|string',
            'description' => 'required|string',
            'catatan' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string',
        ]);

        $letter = $request->user()->letters()->create([
            'id_code' => $this->nextCode(Letter::class, 'SK'),
            'jenis' => $data['jenis'],
            'description' => $data['description'],
            'catatan' => $data['catatan'] ?? null,
            'attachments' => $data['attachments'] ?? null,
            'status' => 'DIAJUKAN',
        ]);

        $this->notify($request->user(), "Pengajuan {$letter->id_code} dikirim: {$letter->jenis}");

        return response()->json(['data' => $letter], 201);
    }

    public function lettersShow(Request $request, int $id): JsonResponse
    {
        $l = $request->user()->letters()->findOrFail($id);
        return response()->json(['data' => $l]);
    }

    /** Warga boleh edit pengajuan surat miliknya selama masih DIAJUKAN. */
    public function lettersUpdate(Request $request, int $id): JsonResponse
    {
        $l = $request->user()->letters()->findOrFail($id);
        if ($l->status !== 'DIAJUKAN') {
            return response()->json(['message' => 'Hanya pengajuan berstatus DIAJUKAN yang bisa diubah.'], 422);
        }
        $data = $request->validate([
            'jenis' => 'required|string',
            'description' => 'required|string',
            'catatan' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string',
        ]);
        $l->update($data);
        return response()->json(['data' => $l]);
    }

    public function lettersCancel(Request $request, int $id): JsonResponse
    {
        $l = $request->user()->letters()->findOrFail($id);
        if (in_array($l->status, ['CLOSED', 'DITOLAK'], true)) {
            return response()->json(['message' => 'Pengajuan sudah selesai, tidak bisa dibatalkan.'], 422);
        }
        $l->update(['status' => 'DITOLAK']);
        $this->notify($request->user(), "Pengajuan {$l->id_code} dibatalkan oleh Anda.");
        return response()->json(['data' => $l]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'wa' => 'required|string|max:20',
            'email' => ['nullable', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users', 'email')->ignore($user->id)],
            'alamat' => 'required|string',
            'avatar' => 'nullable|string',
        ]);
        $user->update([
            'wa' => $data['wa'],
            'email' => $data['email'] ?? null,
            'alamat' => $data['alamat'],
            ...(!empty($data['avatar']) ? ['avatar' => $data['avatar']] : []),
        ]);

        return response()->json(['data' => AuthController::userPayload($user)]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $items = $request->user()->notifications()->orderByDesc('created_at')->limit(100)->get();
        return response()->json(['data' => $items]);
    }

    public function notificationsSeen(Request $request): JsonResponse
    {
        $request->user()->notifications()->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(null, 204);
    }

    /** Ganti password saat login (cek password lama). */
    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        $user = $request->user();
        if (!\Illuminate\Support\Facades\Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Password lama salah.'], 422);
        }
        $user->update(['password' => $data['password']]);
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();
        return response()->json(['data' => ['message' => 'Password berhasil diubah.']]);
    }

    /* Public tracking returns status only. This route is intentionally outside the
       auth:sanctum group, and Complaint/Letter hide nothing but Complaint::token,
       so serialising the model exposed the complainant's description, RT/RW,
       gmaps_link (their address), evidence photos, the closure report and user_id.
       id_code is a global sequential counter (see nextCode), so without this an
       anonymous caller could enumerate and read every complaint and letter on file.

       Residents who want the full record already have it behind auth at
       GET /complaints (portal warga) — no need to widen this endpoint. */
    private const TRACKING_PUBLIC_FIELDS = [
        'id_code', 'title', 'jenis', 'category', 'status', 'created_at', 'updated_at',
    ];

    public function tracking(string $code): JsonResponse
    {
        $t = strtoupper($code);
        $complaint = Complaint::where('id_code', $t)->first();
        if ($complaint) {
            return response()->json(['data' => [
                'kind' => 'Pengaduan',
                'status' => $complaint->status,
                'item' => $complaint->only(self::TRACKING_PUBLIC_FIELDS),
            ]]);
        }
        $letter = Letter::where('id_code', $t)->first();
        if ($letter) {
            return response()->json(['data' => [
                'kind' => 'Surat',
                'status' => $letter->status,
                'item' => $letter->only(self::TRACKING_PUBLIC_FIELDS),
            ]]);
        }
        return response()->json(['message' => 'Kode tidak ditemukan.'], 404);
    }

    private function notify($user, string $message): void
    {
        Notifier::notify($user, $message);
    }

    private function nextCode(string $model, string $prefix): string
    {
        // Anti race: kunci baris max dalam transaksi agar dua request
        // bersamaan tidak menghasilkan id_code kembar (kolom unique).
        return DB::transaction(function () use ($model, $prefix) {
            $table = (new $model)->getTable();
            $max = DB::table($table)
                ->where('id_code', 'like', $prefix.'-%')
                ->lockForUpdate()
                ->selectRaw('MAX(CAST(SUBSTRING_INDEX(id_code, "-", -1) AS UNSIGNED)) AS m')
                ->value('m');
            $code = $prefix.'-'.str_pad((string) ((int) $max + 1), 3, '0', STR_PAD_LEFT);
            // Fallback bila tetap tabrakan (mis. retry): tambah suffix waktu.
            if (DB::table($table)->where('id_code', $code)->exists()) {
                $code = $prefix.'-'.str_pad((string) ((int) $max + 1), 3, '0', STR_PAD_LEFT).'-'.substr((string) time(), -3);
            }
            return $code;
        });
    }
}