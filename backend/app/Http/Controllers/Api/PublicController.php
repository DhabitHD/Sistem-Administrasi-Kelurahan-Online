<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Dokumen;
use App\Models\Layanan;
use App\Models\Perangkat;
use App\Models\Video;
use App\Models\Pengumuman;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function berita(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $items = Berita::orderBy('id', 'desc')
            ->when($q !== '', fn ($b) => $b->where('title', 'like', "%$q%")->orWhere('category', 'like', "%$q%"))
            ->get();
        return response()->json(['data' => $items]);
    }

    public function beritaShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Berita::where('slug', $slug)->firstOrFail()]);
    }

    public function pengumuman(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $items = Pengumuman::orderBy('id', 'desc')
            ->when($q !== '', fn ($b) => $b->where('title', 'like', "%$q%"))
            ->get();
        return response()->json(['data' => $items]);
    }

    public function pengumumanShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Pengumuman::where('slug', $slug)->firstOrFail()]);
    }

    public function layanan(): JsonResponse
    {
        return response()->json(['data' => Layanan::orderBy('id')->get()]);
    }

    public function layananShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Layanan::where('slug', $slug)->firstOrFail()]);
    }

    public function dokumen(): JsonResponse
    {
        return response()->json(['data' => Dokumen::orderBy('id', 'desc')->get()]);
    }

    public function dokumenShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Dokumen::where('slug', $slug)->firstOrFail()]);
    }

    public function perangkat(): JsonResponse
    {
        return response()->json(['data' => Perangkat::orderBy('order')->orderBy('id')->get()]);
    }

    public function videos(): JsonResponse
    {
        return response()->json(['data' => Video::where('is_active', true)->orderBy('order')->orderBy('id')->get()]);
    }

    public function cari(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $out = [];
        foreach (Berita::where('title', 'like', "%$q%")->orWhere('summary', 'like', "%$q%")->get() as $it) {
            $out[] = ['type' => 'berita', 'item' => $it];
        }
        foreach (Pengumuman::where('title', 'like', "%$q%")->orWhere('summary', 'like', "%$q%")->get() as $it) {
            $out[] = ['type' => 'pengumuman', 'item' => $it];
        }
        foreach (Layanan::where('name', 'like', "%$q%")->orWhere('short', 'like', "%$q%")->get() as $it) {
            $out[] = ['type' => 'layanan', 'item' => $it];
        }
        return response()->json(['data' => $out]);
    }

    public function visits(): JsonResponse
    {
        $visit = Visit::firstOrCreate(['tanggal' => now()->toDateString()], ['count' => 0]);
        $visit->increment('count');
        return response()->json(['data' => ['total' => $visit->count]]);
    }
}