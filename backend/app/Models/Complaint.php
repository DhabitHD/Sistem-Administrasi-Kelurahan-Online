<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'id_code', 'title', 'category', 'description', 'rt', 'rw', 'gmaps_link', 'photo', 'photos', 'status', 'officer_id', 'token', 'laporan', 'laporan_foto', 'laporan_fotos'])]
#[Hidden(['token'])]
class Complaint extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['photos' => 'array', 'laporan_fotos' => 'array'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function officer(): BelongsTo
    {
        return $this->belongsTo(Officer::class);
    }
}