<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Services\Notifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TugasController extends Controller
{
    public function show(string $token): JsonResponse
    {
        $c = Complaint::with('officer:id,nama,wa,foto')->where('token', $token)->first();
        if (!$c) {
            return response()->json(['message' => 'Tautan tidak valid.'], 404);
        }
        return response()->json(['data' => $this->payload($c)]);
    }

    public function store(Request $request, string $token): JsonResponse
    {
        $c = Complaint::with('officer:id,nama,wa,foto')->where('token', $token)->first();
        if (!$c) {
            return response()->json(['message' => 'Tautan tidak valid.'], 404);
        }
        if (in_array($c->status, ['CLOSED', 'DITOLAK'], true)) {
            return response()->json(['message' => $c->status === 'CLOSED' ? 'Pengaduan ini sudah ditutup.' : 'Pengaduan ini ditolak.'], 422);
        }

        $data = $request->validate([
            'laporan' => 'required|string',
            'laporan_foto' => 'nullable|string',
            'laporan_fotos' => 'nullable|array',
            'laporan_fotos.*' => 'string',
        ]);

        $foto = null;
        if (!empty($data['laporan_foto'])) {
            $foto = $this->storeFoto($data['laporan_foto']);
        }
        $fotos = array_map(fn ($d) => $this->storeFoto($d), $data['laporan_fotos'] ?? []);

        $c->update([
            'laporan' => $data['laporan'],
            'laporan_foto' => $foto,
            'laporan_fotos' => array_values($fotos) ?: null,
            'status' => 'CLOSED',
        ]);
        $c->load('officer:id,nama,wa,foto');

        Notifier::notify($c->user, "Pengaduan {$c->id_code} telah ditutup: {$c->title}. Terima kasih atas laporannya.");

        return response()->json(['data' => $this->payload($c)]);
    }

    private function payload(Complaint $c): array
    {
        return [
            'id' => $c->id, 'id_code' => $c->id_code, 'title' => $c->title, 'category' => $c->category,
            'description' => $c->description, 'rt' => $c->rt, 'rw' => $c->rw, 'gmaps_link' => $c->gmaps_link,
            'photo' => $c->photo, 'photos' => $c->photos, 'status' => $c->status, 'laporan' => $c->laporan, 'laporan_foto' => $c->laporan_foto, 'laporan_fotos' => $c->laporan_fotos,
            'created_at' => $c->created_at,
            'petugas' => $c->officer ? ['id' => $c->officer->id, 'nama' => $c->officer->nama, 'wa' => $c->officer->wa, 'foto' => $c->officer->foto] : null,
        ];
    }

    private function storeFoto(string $dataUrl): string
    {
        if (!preg_match('#^data:image/(jpeg|png|webp);base64,#', $dataUrl, $m)) {
            throw ValidationException::withMessages(['laporan_foto' => 'Foto laporan harus berupa gambar (jpeg/png/webp).']);
        }
        $bin = base64_decode(substr($dataUrl, (int) strpos($dataUrl, ',') + 1), true);
        if ($bin === false || $bin === '' || strlen($bin) > 500 * 1024) {
            throw ValidationException::withMessages(['laporan_foto' => 'Foto laporan tidak valid atau melebihi 500 KB.']);
        }
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $name = 'anon_'.time().'_'.uniqid().'.'.$ext;
        Storage::disk('public')->put("uploads/{$name}", $bin);
        return url('/storage/uploads/'.$name);
    }
}