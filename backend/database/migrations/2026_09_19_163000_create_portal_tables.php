<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('id_code', 20)->unique();
            $table->string('title');
            $table->string('category');
            $table->text('description');
            $table->string('location');
            $table->string('photo')->nullable();
            $table->enum('status', ['DIAJUKAN', 'IN_PROGRESS', 'CLOSED', 'DITOLAK'])->default('DIAJUKAN');
            $table->timestamps();
        });

        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('id_code', 20)->unique();
            $table->string('jenis');
            $table->text('description');
            $table->string('catatan')->nullable();
            $table->enum('status', ['DIAJUKAN', 'IN_PROGRESS', 'SIAP_DIAMBIL', 'CLOSED', 'DITOLAK'])->default('DIAJUKAN');
            $table->timestamps();
        });

        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category')->default('Informasi');
            $table->string('summary');
            $table->string('image')->nullable();
            $table->longText('content');
            $table->string('date');
            $table->timestamps();
        });

        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('summary');
            $table->string('image')->nullable();
            $table->longText('content');
            $table->string('date');
            $table->timestamps();
        });

        Schema::create('layanan', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('short');
            $table->string('icon')->default('file-text');
            $table->longText('requirements');
            $table->string('process');
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('text');
            $table->timestamps();
        });

        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->unsignedInteger('count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('layanan');
        Schema::dropIfExists('pengumuman');
        Schema::dropIfExists('berita');
        Schema::dropIfExists('letters');
        Schema::dropIfExists('complaints');
    }
};