<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'title', 'category', 'summary', 'image', 'content', 'date'])]
class Berita extends Model
{
    use HasFactory;

    protected $table = 'berita';

    protected function casts(): array
    {
        return ['content' => 'array'];
    }
}