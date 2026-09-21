<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('officers', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('wa', 20);
            $table->string('foto')->nullable();
            $table->timestamps();
        });

        Schema::table('complaints', function (Blueprint $table) {
            $table->foreignId('officer_id')->nullable()->after('status')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropConstrainedForeignId('officer_id');
        });
        Schema::dropIfExists('officers');
    }
};