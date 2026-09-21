<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'title', 'category', 'desc', 'icon', 'file', 'content', 'date'])]
class Dokumen extends Model
{
    use HasFactory;

    protected $table = 'dokumen';

    protected function casts(): array
    {
        return ['content' => 'array'];
    }
}