<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Complaint;
use App\Models\Letter;
use App\Models\Officer;
use App\Models\User;
use App\Models\Visit;
use App\Services\Notifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private const COMPLAINT_FLOW = ['DIAJUKAN', 'IN_PROGRESS', 'CLOSED'];
    private const LETTER_FLOW = ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL', 'CLOSED'];

    public function wargaIndex(Request $request): JsonResponse
    {
        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString();

        $query = User::where('role', 'warga');
        if (in_array($status, ['PENDING', 'VERIFIED', 'REJECTED'], true)) {
            $query->where('status', $status);
        }
        if ($q !== '') {
            $query->where(fn ($b) => $b->where('name', 'like', "%$q%")->orWhere('nik', 'like', "%$q%")->orWhere('email', 'like', "%$q%"));
        }

        return response()->json(['data' => $query->orderByDesc('id')->get()]);
    }

    public function wargaStatus(Request $request, string $nik): JsonResponse
    {
        $data = $request->validate([
            'status' => 'required|in:VERIFIED,REJECTED',
            'note' => 'nullable|string|max:1000',
        ]);
        $user = User::where('nik', $nik)->where('role', 'warga')->first();
        if (!$user) {
            return response()->json(['message' => 'Warga tidak ditemukan.'], 404);
        }
        $user->update(['status' => $data['status']]);

        $note = trim((string) $data['note'] ?? '');
        $pesan = $data['status'] === 'VERIFIED'
            ? 'Akun Anda telah diverifikasi dan siap digunakan.'.($note !== '' ? ' Catatan: '.$note : '')
            : ($note !== '' ? 'Pendaftaran Anda ditolak: '.$note : 'Pendaftaran Anda ditolak. Hubungi kelurahan untuk keterangan.');
        Notifier::notify($user, $pesan);
        ActivityLog::create(['user_id' => $user->id, 'text' => "Status akun diubah menjadi {$data['status']} (admin)".($note !== '' ? " — {$note}" : '')]);

        return response()->json(['data' => $user]);
    }

    public function statusComplaint(Request $request, int $id): JsonResponse
    {
        return $this->changeStatus($request, Complaint::findOrFail($id), self::COMPLAINT_FLOW, 'Pengaduan');
    }

    public function statusLetter(Request $request, int $id): JsonResponse
    {
        return $this->changeStatus($request, Letter::findOrFail($id), self::LETTER_FLOW, 'Pengajuan');
    }

    private function changeStatus(Request $request, $item, array $flow, string $label): JsonResponse
    {
        $data = $request->validate(['status' => 'required|string']);
        $next = $data['status'];

        if (!in_array($next, [...$flow, 'DITOLAK'], true)) {
            return response()->json(['message' => 'Status tidak valid.'], 422);
        }
        if ($item->status === $next) {
            return response()->json(['message' => 'Status sudah dalam keadaan tersebut.'], 422);
        }
        $isClosed = in_array($item->status, ['CLOSED', 'DITOLAK'], true);
        $isRegress = $next !== 'DITOLAK' && array_search($next, $flow, true) <= array_search($item->status, $flow, true);
        if ($isClosed || $isRegress) {
            return response()->json(['message' => 'Peralihan status tidak diperbolehkan mundur.'], 422);
        }

        $item->update(['status' => $next]);

        $labelMap = ['DIAJUKAN' => 'diajukan ke kelurahan', 'IN_PROGRESS' => 'sedang diproses', 'SIAP_DIAMBIL' => 'siap diambil', 'CLOSED' => 'selesai', 'DITOLAK' => 'ditolak'];
        Notifier::notify($item->user, "{$label} {$item->id_code} kini {$labelMap[$next]}");
        ActivityLog::create(['user_id' => $item->user_id, 'text' => "{$label} {$item->id_code} kini {$labelMap[$next]} (admin)"]);

        return response()->json(['data' => $item]);
    }

    public function adminsIndex(): JsonResponse
    {
        return response()->json(['data' => User::where('role', 'admin')->orderByDesc('id')->get()]);
    }

    public function adminsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'wa' => 'nullable|string|max:20',
            'avatar' => 'nullable|string',
        ]);
        $user = User::create([
            'name' => $data['nama'],
            'email' => $data['email'],
            'password' => $data['password'],
            'wa' => $data['wa'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'role' => 'admin',
            'status' => 'VERIFIED',
        ]);
        return response()->json(['data' => $user], 201);
    }

    public function adminsUpdate(Request $request, int $id): JsonResponse
    {
        $admin = User::where('role', 'admin')->findOrFail($id);
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'wa' => 'nullable|string|max:20',
            'avatar' => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);
        $patch = [
            'name' => $data['nama'],
            'wa' => $data['wa'] ?? null,
            'avatar' => $data['avatar'] ?? null,
        ];
        if (!empty($data['password'])) {
            $patch['password'] = $data['password'];
        }
        $admin->update($patch);
        return response()->json(['data' => $admin]);
    }

    public function adminsDestroy(Request $request, int $id): JsonResponse
    {
        if ($request->user()->id === $id) {
            return response()->json(['message' => 'Tidak bisa menghapus akun admin sendiri.'], 422);
        }
        $admin = User::where('role', 'admin')->findOrFail($id);
        $admin->delete();
        return response()->json(null, 204);
    }

    public function complaintsAll(): JsonResponse
    {
        $items = Complaint::with('user:id,name')->with('officer:id,nama,wa,foto')->orderByDesc('created_at')->get()
            ->map(fn ($c) => [
                'id' => $c->id, 'id_code' => $c->id_code, 'title' => $c->title, 'category' => $c->category,
                'description' => $c->description, 'rt' => $c->rt, 'rw' => $c->rw, 'gmaps_link' => $c->gmaps_link,
                'photo' => $c->photo, 'photos' => $c->photos, 'status' => $c->status, 'laporan' => $c->laporan, 'laporan_foto' => $c->laporan_foto, 'laporan_fotos' => $c->laporan_fotos,
                'created_at' => $c->created_at,
                'owner' => $c->user->name ?? '-',
                'petugas' => $c->officer ? ['id' => $c->officer->id, 'nama' => $c->officer->nama, 'wa' => $c->officer->wa, 'foto' => $c->officer->foto] : null,
            ]);
        return response()->json(['data' => $items]);
    }

    public function officersIndex(): JsonResponse
    {
        return response()->json(['data' => Officer::orderByDesc('id')->get()]);
    }

    public function officersStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'wa' => 'required|string|max:20',
            'foto' => 'nullable|string',
        ]);
        $officer = Officer::create([
            'nama' => $data['nama'],
            'wa' => $data['wa'],
            'foto' => $data['foto'] ?? null,
        ]);
        return response()->json(['data' => $officer], 201);
    }

    public function officersUpdate(Request $request, int $id): JsonResponse
    {
        $officer = Officer::findOrFail($id);
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'wa' => 'required|string|max:20',
            'foto' => 'nullable|string',
        ]);
        $officer->update([
            'nama' => $data['nama'],
            'wa' => $data['wa'],
            ...(!empty($data['foto']) ? ['foto' => $data['foto']] : []),
        ]);
        return response()->json(['data' => $officer]);
    }

    public function officersDestroy(int $id): JsonResponse
    {
        Officer::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function closeComplaint(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'laporan' => 'required|string',
            'laporan_foto' => 'nullable|string',
            'laporan_fotos' => 'nullable|array',
            'laporan_fotos.*' => 'string',
        ]);
        $complaint = Complaint::findOrFail($id);
        if (in_array($complaint->status, ['CLOSED', 'DITOLAK'], true)) {
            return response()->json(['message' => 'Pengaduan sudah selesai/ditolak, tidak bisa ditutup lagi.'], 422);
        }
        $complaint->update([
            'laporan' => $data['laporan'],
            'laporan_foto' => $data['laporan_foto'] ?? null,
            'laporan_fotos' => $data['laporan_fotos'] ?? null,
            'status' => 'CLOSED',
        ]);
        Notifier::notify($complaint->user, "Pengaduan {$complaint->id_code} telah ditutup oleh administrasi: {$complaint->title}");
        return response()->json(['data' => $complaint]);
    }

    public function assignOfficer(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['officer_id' => 'required|exists:officers,id']);
        $complaint = Complaint::with('user:id,name')->findOrFail($id);

        if (in_array($complaint->status, ['CLOSED', 'DITOLAK'], true)) {
            return response()->json(['message' => 'Pengaduan sudah selesai/ditolak, tidak bisa diplot petugas.'], 422);
        }
        if ((int) $complaint->officer_id === (int) $data['officer_id']) {
            return response()->json(['message' => 'Petugas tersebut sudah diplot ke pengaduan ini.'], 422);
        }

        $officer = Officer::findOrFail($data['officer_id']);
        if (!$complaint->token) {
            $complaint->token = \Illuminate\Support\Str::random(40);
        }
        $complaint->update(['officer_id' => $officer->id, 'status' => 'IN_PROGRESS']);
        $complaint->load('officer');

        $owner = $complaint->user->name ?? '-';
        $magicLink = rtrim((string) config('services.frontend.url'), '/').'/tugas/'.$complaint->token;
        $text = "Anda mendapat tugas lapangan.\n\n"
            ."Pengaduan: {$complaint->id_code}\n"
            ."Judul: {$complaint->title}\n"
            ."Kategori: {$complaint->category}\n"
            ."Deskripsi: {$complaint->description}\n"
            ."Lokasi: RT ".str_pad((string) $complaint->rt, 2, '0', STR_PAD_LEFT)." / RW ".str_pad((string) $complaint->rw, 2, '0', STR_PAD_LEFT)
            .($complaint->gmaps_link ? "\nPeta: {$complaint->gmaps_link}" : '')
            ."\nPelapor: {$owner}"
            ."\n\nIsi laporan penanganan untuk menutup pengaduan:\n{$magicLink}";

        $digits = preg_replace('/\D/', '', $officer->wa);
        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        }
        $waLink = 'https://wa.me/'.$digits.'?text='.rawurlencode($text);

        return response()->json(['data' => [
            'item' => $complaint,
            'petugas' => $officer,
            'wa_link' => $waLink,
            'magic_link' => $magicLink,
        ]]);
    }

    public function lettersAll(): JsonResponse
    {
        $items = Letter::with('user:id,name,nik,kk,wa,alamat,email,ktp')->orderByDesc('created_at')->get()
            ->map(fn ($l) => [
                'id' => $l->id, 'id_code' => $l->id_code, 'jenis' => $l->jenis, 'description' => $l->description,
                'catatan' => $l->catatan, 'attachments' => $l->attachments,
                'status' => $l->status, 'created_at' => $l->created_at,
                'owner' => $l->user->name ?? '-',
                'nik' => $l->user->nik ?? null,
                'kk' => $l->user->kk ?? null,
                'wa' => $l->user->wa ?? null,
                'alamat' => $l->user->alamat ?? null,
                'email' => $l->user->email ?? null,
                'ktp' => $l->user->ktp ?? null,
            ]);
        return response()->json(['data' => $items]);
    }

    public function stats(Request $request): JsonResponse
    {
        $today = now()->toDateString();
        return response()->json(['data' => [
            'warga_total' => User::where('role', 'warga')->count(),
            'warga_pending' => User::where('role', 'warga')->where('status', 'PENDING')->count(),
            'pengaduan_total' => Complaint::count(),
            'pengaduan_aktif' => Complaint::whereIn('status', ['DIAJUKAN', 'IN_PROGRESS'])->count(),
            'surat_total' => Letter::count(),
            'surat_aktif' => Letter::whereIn('status', ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL'])->count(),
            'berita_total' => \App\Models\Berita::count(),
            'kunjungan_hari_ini' => (int) Visit::where('tanggal', $today)->value('count'),
        ]]);
    }
}