<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nama_lurah', 'foto_lurah', 'struktur_image', 'struktur_desc', 'visi', 'misi', 'sambutan', 'kontak_alamat', 'kontak_telp', 'kontak_email', 'kontak_jam'])]
class Profil extends Model
{
    use HasFactory;

    protected $table = 'profil';

    protected function casts(): array
    {
        return ['misi' => 'array', 'sambutan' => 'array'];
    }
}