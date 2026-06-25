<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('promo_id')->nullable()->after('notes')->constrained()->nullOnDelete();
            $table->integer('discount_amount')->default(0)->after('promo_id');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['promo_id']);
            $table->dropColumn(['promo_id', 'discount_amount']);
        });
    }
};
