<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx,mp4,webm,mov|max:51200',
        ]);

        $user = $request->user();
        $prefix = $user ? (string) $user->id : 'anon';
        $file = $validated['file'];
        $name = $prefix.'_'.time().'_'.uniqid().'.'.$file->guessExtension();

        Storage::disk('public')->putFileAs('uploads', $file, $name);

        $url = url('/storage/uploads/'.$name);

        return response()->json(['data' => ['path' => $url, 'name' => $name]], 201);
    }
}