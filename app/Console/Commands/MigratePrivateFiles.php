<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * Pindahkan berkas identitas warga (ktp, avatar) dari disk publik
 * (/storage/uploads/...) ke disk privat (private/uploads/...) dan
 * perbarui path di database. Idempotent: baris yang sudah privat
 * dilewati; file sumber yang hilang hanya dilaporkan.
 */
class MigratePrivateFiles extends Command
{
    protected $signature = 'files:migrate-private';

    protected $description = 'Pindahkan KTP/avatar warga dari storage publik ke privat';

    public function handle(): int
    {
        $moved = 0;
        $missing = 0;
        foreach (User::where('role', 'warga')->cursor() as $user) {
            $dirty = false;
            foreach (['ktp', 'avatar'] as $field) {
                $path = $user->{$field};
                if (!$path || !str_starts_with($path, '/storage/uploads/')) {
                    continue;
                }
                $rel = substr($path, strlen('/storage/'));
                if (!Storage::disk('public')->exists($rel)) {
                    $this->warn("hilang: {$path} (nik {$user->nik})");
                    $missing++;
                    continue;
                }
                $name = basename($rel);
                $dest = "uploads/{$name}";
                if (Storage::disk('local')->exists($dest)) {
                    $dest = 'uploads/'.uniqid().'_'.$name;
                }
                Storage::disk('local')->writeStream($dest, Storage::disk('public')->readStream($rel));
                Storage::disk('public')->delete($rel);
                $user->{$field} = 'private/'.$dest;
                $dirty = true;
                $moved++;
            }
            if ($dirty) {
                $user->save();
            }
        }
        $this->info("dipindah: {$moved}, file sumber hilang: {$missing}");

        return self::SUCCESS;
    }
}
