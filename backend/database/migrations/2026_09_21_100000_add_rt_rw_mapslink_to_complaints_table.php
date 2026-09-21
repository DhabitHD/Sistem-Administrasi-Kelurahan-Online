<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn('location');
            $table->unsignedTinyInteger('rt')->default(0)->after('description');
            $table->unsignedTinyInteger('rw')->default(0)->after('rt');
            $table->string('gmaps_link')->nullable()->after('rw');
        });
    }

    public function down(): void
    {
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropColumn(['rt', 'rw', 'gmaps_link']);
            $table->string('location');
        });
    }
};