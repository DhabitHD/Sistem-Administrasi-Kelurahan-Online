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
        $items = $request->user()->complaints()->orderByDesc('created_at')->get();
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

    public function lettersIndex(Request $request): JsonResponse
    {
        $items = $request->user()->letters()->orderByDesc('created_at')->get();
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

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'wa' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'alamat' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = $request->user();
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
        $items = $request->user()->notifications()->orderByDesc('created_at')->get();
        return response()->json(['data' => $items]);
    }

    public function notificationsSeen(Request $request): JsonResponse
    {
        $request->user()->notifications()->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(null, 204);
    }

    public function tracking(Request $request, string $code): JsonResponse
    {
        $t = strtoupper($code);
        $complaint = Complaint::where('id_code', $t)->first();
        if ($complaint) {
            return response()->json(['data' => ['kind' => 'Pengaduan', 'status' => $complaint->status, 'item' => $complaint]]);
        }
        $letter = Letter::where('id_code', $t)->first();
        if ($letter) {
            return response()->json(['data' => ['kind' => 'Surat', 'status' => $letter->status, 'item' => $letter]]);
        }
        return response()->json(['message' => 'Kode tidak ditemukan.'], 404);
    }

    private function notify($user, string $message): void
    {
        Notifier::notify($user, $message);
    }

    private function nextCode(string $model, string $prefix): string
    {
        $max = DB::table((new $model)->getTable())
            ->where('id_code', 'like', $prefix.'-%')
            ->selectRaw('MAX(CAST(SUBSTRING_INDEX(id_code, "-", -1) AS UNSIGNED)) AS m')
            ->value('m');
        return $prefix.'-'.str_pad((string) ((int) $max + 1), 3, '0', STR_PAD_LEFT);
    }
}