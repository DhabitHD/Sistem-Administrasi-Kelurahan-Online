<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'role', 'name', 'photo', 'order'])]
class Perangkat extends Model
{
    use HasFactory;

    protected $table = 'perangkat';
}