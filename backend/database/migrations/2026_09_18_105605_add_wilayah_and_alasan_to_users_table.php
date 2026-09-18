<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan relasi ke tabel wilayah
            $table->foreignId('wilayah_id')->nullable()->after('id')->constrained('wilayah')->onDelete('restrict');
            
            // Menambahkan kolom alasan penolakan untuk verifikasi
            $table->text('alasan_penolakan')->nullable()->after('status_akun');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['wilayah_id']);
            $table->dropColumn('wilayah_id');
            $table->dropColumn('alasan_penolakan');
        });
    }
};
