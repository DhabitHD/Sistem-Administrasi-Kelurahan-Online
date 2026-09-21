<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'title', 'summary', 'image', 'content', 'date'])]
class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumuman';

    protected function casts(): array
    {
        return ['content' => 'array'];
    }
}