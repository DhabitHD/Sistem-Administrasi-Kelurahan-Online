<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->timestamp('token_expires_at')->nullable()->after('token');
        });
        // Token lama yang masih aktif diberi batas 3 hari sejak deploy.
        DB::table('complaints')
            ->whereNotNull('token')
            ->whereNull('token_expires_at')
            ->update(['token_expires_at' => now()->addDays(3)]);
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn('token_expires_at');
        });
    }
};
