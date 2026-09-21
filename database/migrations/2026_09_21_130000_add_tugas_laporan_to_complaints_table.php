<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->string('token', 64)->nullable()->unique()->after('status');
            $table->text('laporan')->nullable()->after('officer_id');
            $table->string('laporan_foto')->nullable()->after('laporan');
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn(['token', 'laporan', 'laporan_foto']);
        });
    }
};