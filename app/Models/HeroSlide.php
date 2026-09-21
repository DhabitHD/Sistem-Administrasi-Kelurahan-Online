<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['image', 'kicker', 'title_before', 'title_span', 'lead', 'order', 'is_active'])]
class HeroSlide extends Model
{
    use HasFactory;

    protected $table = 'hero_slides';

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}