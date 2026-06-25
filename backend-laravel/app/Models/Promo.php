<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'code', 'discount_type', 'discount_value', 'min_rental_days',
    'max_discount', 'valid_from', 'valid_until', 'usage_limit',
    'used_count', 'is_active',
])]
class Promo extends Model
{
    /** @use HasFactory<\Database\Factories\PromoFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'valid_from' => 'date',
            'valid_until' => 'date',
        ];
    }

    public function isValid(int $days = 0): bool
    {
        $now = Carbon::today();
        return $this->is_active
            && $now->greaterThanOrEqualTo($this->valid_from)
            && $now->lessThanOrEqualTo($this->valid_until)
            && (!$this->usage_limit || $this->used_count < $this->usage_limit)
            && (!$this->min_rental_days || $days >= $this->min_rental_days);
    }

    public function calculateDiscount(int $subtotal, int $days = 0): int
    {
        if (!$this->isValid($days)) {
            return 0;
        }

        $discount = $this->discount_type === 'percentage'
            ? (int) round($subtotal * $this->discount_value / 100)
            : $this->discount_value;

        if ($this->max_discount) {
            $discount = min($discount, $this->max_discount);
        }

        return min($discount, $subtotal);
    }
}
