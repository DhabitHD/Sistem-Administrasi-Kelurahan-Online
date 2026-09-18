<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Kredensial & Identitas Utama
            $table->string('nik', 16)->unique();
            $table->string('no_kk', 16)->nullable(); // Opsional
            $table->string('nama_lengkap');
            $table->string('password');
            
            // Data Demografi
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('agama');
            $table->string('pekerjaan');
            
            // Informasi Kontak & Alamat
            $table->text('alamat_lengkap');
            $table->string('nomor_rumah')->nullable(); // Opsional
            $table->string('nomor_hp', 20);
            $table->string('email')->unique()->nullable(); // Opsional
            
            // Berkas & Sistem
            $table->string('foto_ktp'); 
            $table->enum('role', ['admin', 'warga', 'petugas'])->default('warga');
            $table->enum('status_akun', ['PENDING', 'VERIFIED', 'REJECTED'])->default('PENDING');
            
            $table->rememberToken();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
