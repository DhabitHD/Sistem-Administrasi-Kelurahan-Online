<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->string('kontak_alamat')->nullable();
            $table->string('kontak_telp')->nullable();
            $table->string('kontak_email')->nullable();
            $table->string('kontak_jam')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->dropColumn(['kontak_alamat', 'kontak_telp', 'kontak_email', 'kontak_jam']);
        });
    }
};