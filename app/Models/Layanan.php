<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'name', 'short', 'icon', 'requirements', 'process'])]
class Layanan extends Model
{
    use HasFactory;

    protected $table = 'layanan';

    protected function casts(): array
    {
        return ['requirements' => 'array'];
    }
}