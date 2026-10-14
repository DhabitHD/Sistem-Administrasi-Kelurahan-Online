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
    private function paginate(Request $request, $query, int $default = 15)
    {
        $perPage = max(1, min(100, (int) $request->query('per_page', $default)));
        // Backward-compatible: tanpa ?page/per_page kembalikan array polos
        // agar portal lama tidak pecah; dengan param kembalikan {data,meta}.
        if (!$request->query('page') && !$request->query('per_page')) {
            return response()->json(['data' => $query->get()]);
        }
        $p = $query->paginate($perPage);
        return response()->json(['data' => $p->items(), 'meta' => [
            'current_page' => $p->currentPage(), 'last_page' => $p->lastPage(),
            'per_page' => $p->perPage(), 'total' => $p->total(),
        ]]);
    }

    private function cached(string $key, int $ttl, callable $fn)
    {
        // v3: kunci lama pernah menyimpan Collection Eloquent yang basi dan
        // terbaca sebagai __PHP_Incomplete_Class; simpan array polos saja.
        // Generasi disematkan agar mutasi admin langsung terlihat (bust).
        $gen = \App\Support\CacheSafe::generation('v3:pubgen');
        return \App\Support\CacheSafe::remember("v3:g{$gen}:".$key, $ttl, $fn);
    }

    public function berita(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $key = 'pub:berita:'.md5($q.'|'.$request->query('page', '').'|'.$request->query('per_page', ''));
        $query = fn () => Berita::orderBy('id', 'desc')
            ->when($q !== '', fn ($b) => $b->where('title', 'like', \App\Support\Like::contains($q))->orWhere('category', 'like', \App\Support\Like::contains($q)));
        if (!$request->query('page') && !$request->query('per_page')) {
            $items = $this->cached($key, 120, fn () => $query()->get()->toArray());
            return response()->json(['data' => $items]);
        }
        return $this->paginate($request, $query());
    }

    public function beritaShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Berita::where('slug', $slug)->firstOrFail()]);
    }

    public function pengumuman(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $key = 'pub:pengumuman:'.md5($q.'|'.$request->query('page', '').'|'.$request->query('per_page', ''));
        if (!$request->query('page') && !$request->query('per_page')) {
            $items = $this->cached($key, 120, fn () => Pengumuman::orderBy('id', 'desc')
                ->when($q !== '', fn ($b) => $b->where('title', 'like', \App\Support\Like::contains($q)))->get()->toArray());
            return response()->json(['data' => $items]);
        }
        return $this->paginate($request, Pengumuman::orderBy('id', 'desc')
            ->when($q !== '', fn ($b) => $b->where('title', 'like', \App\Support\Like::contains($q))));
    }

    public function pengumumanShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Pengumuman::where('slug', $slug)->firstOrFail()]);
    }

    public function layanan(Request $request): JsonResponse
    {
        if (!$request->query('page') && !$request->query('per_page')) {
            return response()->json(['data' => $this->cached('pub:layanan', 300, fn () => Layanan::orderBy('id')->get()->toArray())]);
        }
        return $this->paginate($request, Layanan::orderBy('id'));
    }

    public function layananShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Layanan::where('slug', $slug)->firstOrFail()]);
    }

    public function dokumen(Request $request): JsonResponse
    {
        if (!$request->query('page') && !$request->query('per_page')) {
            return response()->json(['data' => $this->cached('pub:dokumen', 300, fn () => Dokumen::orderBy('id', 'desc')->get()->toArray())]);
        }
        return $this->paginate($request, Dokumen::orderBy('id', 'desc'));
    }

    public function dokumenShow(string $slug): JsonResponse
    {
        return response()->json(['data' => Dokumen::where('slug', $slug)->firstOrFail()]);
    }

    public function perangkat(): JsonResponse
    {
        return response()->json(['data' => $this->cached('pub:perangkat', 600, fn () => Perangkat::orderBy('order')->orderBy('id')->get()->toArray())]);
    }

    public function videos(): JsonResponse
    {
        return response()->json(['data' => $this->cached('pub:videos', 600, fn () => Video::where('is_active', true)->orderBy('order')->orderBy('id')->get()->toArray())]);
    }

    public function cari(Request $request): JsonResponse
    {
        $q = trim($request->string('q')->toString());
        if ($q === '') {
            return response()->json(['data' => []]);
        }
        $limit = max(1, min(20, (int) $request->query('limit', 10)));
        $out = [];
        foreach (Berita::where('title', 'like', \App\Support\Like::contains($q))->orWhere('summary', 'like', \App\Support\Like::contains($q))->limit($limit)->get() as $it) {
            $out[] = ['type' => 'berita', 'item' => $it];
        }
        foreach (Pengumuman::where('title', 'like', \App\Support\Like::contains($q))->orWhere('summary', 'like', \App\Support\Like::contains($q))->limit($limit)->get() as $it) {
            $out[] = ['type' => 'pengumuman', 'item' => $it];
        }
        foreach (Layanan::where('name', 'like', \App\Support\Like::contains($q))->orWhere('short', 'like', \App\Support\Like::contains($q))->limit($limit)->get() as $it) {
            $out[] = ['type' => 'layanan', 'item' => $it];
        }
        return response()->json(['data' => $out]);
    }

    public function visits(): JsonResponse
    {
        $today = now()->toDateString();
        // Satu query atomik, anti race firstOrCreate+increment.
        Visit::upsert([['tanggal' => $today, 'count' => 0, 'created_at' => now(), 'updated_at' => now()]], ['tanggal'], ['updated_at']);
        Visit::where('tanggal', $today)->increment('count');
        $total = (int) Visit::where('tanggal', $today)->value('count');
        return response()->json(['data' => ['total' => $total]]);
    }
}