<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminContentController extends Controller
{
    private function model(string $kind): string
    {
        return match ($kind) {
            'berita' => \App\Models\Berita::class,
            'pengumuman' => \App\Models\Pengumuman::class,
            'layanan' => \App\Models\Layanan::class,
            'dokumen' => \App\Models\Dokumen::class,
            'perangkat' => \App\Models\Perangkat::class,
            'video' => \App\Models\Video::class,
            default => abort(404),
        };
    }

    private function indexQuery(string $kind): \Illuminate\Support\Collection
    {
        return ($this->model($kind))::orderBy('id', 'desc')->get();
    }

    public function index(string $kind): JsonResponse
    {
        return response()->json(['data' => $this->indexQuery($kind)]);
    }

    public function show(string $kind, string $slug): JsonResponse
    {
        return response()->json(['data' => ($this->model($kind))::where('slug', $slug)->firstOrFail()]);
    }

    public function store(Request $request, string $kind): JsonResponse
    {
        $rules = $this->rules($kind);
        $data = $request->validate($rules);
        $data['slug'] = $this->uniqueSlug($kind, Str::slug($data['slug'] ?? ($data['title'] ?? $data['name']) ?: 'konten'));
        $item = ($this->model($kind))::create($data);
        return response()->json(['data' => $item], 201);
    }

    public function update(Request $request, string $kind, string $slug): JsonResponse
    {
        $item = ($this->model($kind))::where('slug', $slug)->firstOrFail();
        $data = $request->validate($this->rules($kind));
        $item->update($data);
        return response()->json(['data' => $item]);
    }

    public function destroy(string $kind, string $slug): JsonResponse
    {
        ($this->model($kind))::where('slug', $slug)->firstOrFail()->delete();
        return response()->json(null, 204);
    }

    private function rules(string $kind): array
    {
        return match ($kind) {
            'berita' => [
                'title' => 'required|string|max:255',
                'category' => 'nullable|string|max:100',
                'summary' => 'required|string',
                'image' => 'nullable|string',
                'content' => 'required|array',
                'date' => 'required|string|max:30',
            ],
            'pengumuman' => [
                'title' => 'required|string|max:255',
                'summary' => 'required|string',
                'image' => 'nullable|string',
                'content' => 'required|array',
                'date' => 'required|string|max:30',
            ],
            'layanan' => [
                'name' => 'required|string|max:255',
                'short' => 'required|string',
                'icon' => 'nullable|string|max:60',
                'requirements' => 'required|array',
                'process' => 'nullable|string',
            ],
            'dokumen' => [
                'title' => 'required|string|max:255',
                'category' => 'nullable|string|max:30',
                'desc' => 'required|string',
                'icon' => 'nullable|string|max:60',
                'file' => 'nullable|string',
                'content' => 'nullable|array',
                'date' => 'required|string|max:30',
            ],
            'perangkat' => [
                'role' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'photo' => 'nullable|string',
                'order' => 'nullable|integer',
            ],
            'video' => [
                'title' => 'required|string|max:255',
                'video' => 'required|string|max:500',
                'desc' => 'nullable|string',
                'is_active' => 'nullable|boolean',
                'order' => 'nullable|integer',
            ],
            default => abort(404),
        };
    }

    private function uniqueSlug(string $kind, string $base, int $i = 0): string
    {
        $slug = $i === 0 ? $base : "{$base}-{$i}";
        if (($this->model($kind))::where('slug', $slug)->exists()) {
            return $this->uniqueSlug($kind, $base, $i + 1);
        }
        return $slug;
    }
}