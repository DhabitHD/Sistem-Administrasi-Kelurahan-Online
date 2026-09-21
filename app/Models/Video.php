<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'title', 'video', 'desc', 'is_active', 'order'])]
class Video extends Model
{
    use HasFactory;

    protected $table = 'videos';

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}