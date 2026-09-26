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

        /* Relative path, not url(). The API and the SPA are served from different
           origins in dev, so an absolute URL is a cross-origin request that the CSP
           img-src directive blocks, and it is not portable across environments. */
        $path = '/storage/uploads/'.$name;

        return response()->json(['data' => ['path' => $path, 'name' => $name]], 201);
    }
}