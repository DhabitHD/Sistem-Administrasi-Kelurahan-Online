<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function public(): JsonResponse
    {
        $slides = HeroSlide::where('is_active', true)->orderBy('order')->get();
        return response()->json(['data' => $slides]);
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => HeroSlide::orderBy('order')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $slide = HeroSlide::create($data);
        return response()->json(['data' => $slide], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->update($this->validated($request));
        return response()->json(['data' => $slide]);
    }

    public function destroy(int $id): JsonResponse
    {
        HeroSlide::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'image' => 'required|string|max:500',
            'kicker' => 'nullable|string|max:120',
            'title_before' => 'nullable|string|max:160',
            'title_span' => 'nullable|string|max:80',
            'lead' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);
    }
}