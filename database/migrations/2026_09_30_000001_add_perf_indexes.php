<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'complaints_status_created_idx');
            $table->index('category', 'complaints_category_idx');
        });
        Schema::table('letters', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'letters_status_created_idx');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->index(['role', 'status'], 'users_role_status_idx');
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index('created_at', 'activity_logs_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropIndex('complaints_status_created_idx');
            $table->dropIndex('complaints_category_idx');
        });
        Schema::table('letters', function (Blueprint $table) {
            $table->dropIndex('letters_status_created_idx');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_status_idx');
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('activity_logs_created_idx');
        });
    }
};
